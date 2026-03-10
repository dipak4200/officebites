package com.canteen.controller;

import com.canteen.entity.Role;
import com.canteen.entity.User;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final com.canteen.repository.FoodItemRepository foodItemRepository;
    private final com.canteen.repository.ConsumptionLogRepository consumptionLogRepository;

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // In a real app, you'd hash passwords here.
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<User>> getAllVendors() {
         List<User> vendors = userRepository.findAll().stream()
                 .filter(u -> u.getRole() == Role.VENDOR)
                 .toList();
         return ResponseEntity.ok(vendors);
    }

    @PostMapping("/admins")
    public ResponseEntity<User> createAdmin(@RequestBody User admin) {
        admin.setRole(Role.ADMIN);
        User savedAdmin = userRepository.save(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    @PostMapping("/vendors")
    public ResponseEntity<User> createVendor(@RequestBody User vendor) {
        vendor.setRole(Role.VENDOR);
        User savedVendor = userRepository.save(vendor);
        return ResponseEntity.ok(savedVendor);
    }

    @PutMapping("/food-items/{id}/toggle")
    public ResponseEntity<com.canteen.entity.FoodItem> toggleFoodItemStatus(
            @PathVariable Long id, 
            @RequestParam boolean isActive) {
        
        Optional<com.canteen.entity.FoodItem> itemOpt = foodItemRepository.findById(id);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        com.canteen.entity.FoodItem item = itemOpt.get();
        item.setIsActive(isActive);
        return ResponseEntity.ok(foodItemRepository.save(item));
    }

    @GetMapping("/reports/nutrition/{employeeId}")
    public ResponseEntity<?> getNutritionReport(@PathVariable Long employeeId) {
        List<com.canteen.entity.ConsumptionLog> logs = consumptionLogRepository.findByEmployeeId(employeeId);
        
        int totalCalories = 0;
        double totalProtein = 0;
        double totalCarbs = 0;
        double totalFats = 0;

        for (com.canteen.entity.ConsumptionLog log : logs) {
            com.canteen.entity.FoodItem food = log.getFoodItem();
            totalCalories += food.getCalories();
            totalProtein += food.getProtein();
            totalCarbs += food.getCarbohydrates();
            totalFats += food.getFats();
        }

        // Return a simple Map summary to avoid effectively-final compiler errors
        Map<String, Object> report = new HashMap<>();
        report.put("employee", employeeId);
        report.put("mealsLogged", logs.size());
        report.put("calories", totalCalories);
        report.put("protein", totalProtein);
        report.put("carbohydrates", totalCarbs);
        report.put("fats", totalFats);

        return ResponseEntity.ok(report);
    }
}
