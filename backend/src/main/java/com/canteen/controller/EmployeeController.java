package com.canteen.controller;

import com.canteen.entity.FoodItem;
import com.canteen.entity.GoalType;
import com.canteen.entity.HealthGoal;
import com.canteen.entity.Role;
import com.canteen.entity.User;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.HealthGoalRepository;
import com.canteen.repository.UserRepository;
import com.canteen.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final HealthGoalRepository healthGoalRepository;
    private final RecommendationService recommendationService;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;

    @PostMapping("/health-goal")
    public ResponseEntity<?> setHealthGoal(Authentication auth, @RequestBody HealthGoal healthGoal) {
        Optional<User> empOpt = userRepository.findByUsername(auth.getName());
        if (empOpt.isEmpty() || empOpt.get().getRole() != Role.EMPLOYEE) {
            return ResponseEntity.status(403).body("Access denied");
        }
        User employee = empOpt.get();
        // Update if exists
        Optional<HealthGoal> existing = healthGoalRepository.findByEmployeeId(employee.getId());
        HealthGoal goal = existing.orElse(new HealthGoal());
        goal.setEmployee(employee);
        goal.setGoalType(healthGoal.getGoalType());
        goal.setTargetDailyCalories(healthGoal.getTargetDailyCalories());
        goal.setTargetDailyProtein(healthGoal.getTargetDailyProtein());
        goal.setCurrentWeight(healthGoal.getCurrentWeight());
        goal.setTargetWeight(healthGoal.getTargetWeight());
        return ResponseEntity.ok(healthGoalRepository.save(goal));
    }

    @GetMapping("/health-goal")
    public ResponseEntity<?> getMyHealthGoal(Authentication auth) {
        Optional<User> empOpt = userRepository.findByUsername(auth.getName());
        if (empOpt.isEmpty()) return ResponseEntity.status(403).build();
        Optional<HealthGoal> goal = healthGoalRepository.findByEmployeeId(empOpt.get().getId());
        return goal.map(ResponseEntity::ok).orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<FoodItem>> getRecommendedFoodItems(Authentication auth) {
        Optional<User> empOpt = userRepository.findByUsername(auth.getName());
        if (empOpt.isEmpty()) return ResponseEntity.status(403).build();
        List<FoodItem> recommendations = recommendationService.getRecommendationsForEmployee(empOpt.get().getId());
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        Optional<User> empOpt = userRepository.findByUsername(auth.getName());
        if (empOpt.isEmpty()) return ResponseEntity.status(404).build();
        User user = empOpt.get();
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "fullName", user.getFullName() != null ? user.getFullName() : "",
            "email", user.getEmail() != null ? user.getEmail() : "",
            "role", user.getRole().name()
        ));
    }
}
