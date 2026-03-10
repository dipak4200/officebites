package com.canteen.controller;

import com.canteen.entity.FoodItem;
import com.canteen.entity.HealthGoal;
import com.canteen.entity.User;
import com.canteen.repository.HealthGoalRepository;
import com.canteen.repository.UserRepository;
import com.canteen.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final HealthGoalRepository healthGoalRepository;
    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @PostMapping("/{employeeId}/health-goal")
    public ResponseEntity<HealthGoal> setHealthGoal(@PathVariable Long employeeId, @RequestBody HealthGoal healthGoal) {
        Optional<User> employeeOpt = userRepository.findById(employeeId);
        if (employeeOpt.isEmpty() || employeeOpt.get().getRole() != com.canteen.entity.Role.EMPLOYEE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        healthGoal.setEmployee(employeeOpt.get());
        HealthGoal savedGoal = healthGoalRepository.save(healthGoal);
        return ResponseEntity.ok(savedGoal);
    }

    @GetMapping("/{employeeId}/recommendations")
    public ResponseEntity<List<FoodItem>> getRecommendedFoodItems(@PathVariable Long employeeId) {
        List<FoodItem> recommendations = recommendationService.getRecommendationsForEmployee(employeeId);
        return ResponseEntity.ok(recommendations);
    }
}
