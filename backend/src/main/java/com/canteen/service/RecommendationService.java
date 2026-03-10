package com.canteen.service;

import com.canteen.entity.FoodItem;
import com.canteen.entity.GoalType;
import com.canteen.entity.HealthGoal;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.HealthGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final FoodItemRepository foodItemRepository;
    private final HealthGoalRepository healthGoalRepository;

    public List<FoodItem> getRecommendationsForEmployee(Long employeeId) {
        Optional<HealthGoal> healthGoalOpt = healthGoalRepository.findByEmployeeId(employeeId);
        List<FoodItem> activeFoodItems = foodItemRepository.findAll().stream()
                .filter(FoodItem::getIsActive)
                .collect(Collectors.toList());

        if (healthGoalOpt.isEmpty()) {
            return activeFoodItems;
        }

        HealthGoal goal = healthGoalOpt.get();

        return activeFoodItems.stream().filter(food -> {
            boolean matches = true;

            if (goal.getGoalType() == GoalType.WEIGHT_LOSS) {
                // E.g., Filter out items > ~30% of target daily calories in one meal
                matches = food.getCalories() <= (goal.getTargetDailyCalories() * 0.35);
            } else if (goal.getGoalType() == GoalType.MUSCLE_GAIN) {
                // E.g., High protein > 20g
                matches = food.getProtein() >= 20.0;
            }

            return matches;
        }).collect(Collectors.toList());
    }
}
