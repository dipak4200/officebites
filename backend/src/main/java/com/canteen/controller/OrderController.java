package com.canteen.controller;

import com.canteen.entity.ConsumptionLog;
import com.canteen.entity.FoodItem;
import com.canteen.entity.User;
import com.canteen.repository.ConsumptionLogRepository;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class OrderController {

    private final ConsumptionLogRepository consumptionLogRepository;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;

    @PostMapping("/{employeeId}/order/{foodItemId}")
    public ResponseEntity<ConsumptionLog> logConsumption(
            @PathVariable Long employeeId,
            @PathVariable Long foodItemId) {

        Optional<User> employeeOpt = userRepository.findById(employeeId);
        Optional<FoodItem> foodOpt = foodItemRepository.findById(foodItemId);

        if (employeeOpt.isEmpty() || foodOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (employeeOpt.get().getRole() != com.canteen.entity.Role.EMPLOYEE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (!foodOpt.get().getIsActive()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Cannot order inactive food
        }

        ConsumptionLog log = new ConsumptionLog();
        log.setEmployee(employeeOpt.get());
        log.setFoodItem(foodOpt.get());
        log.setConsumptionDate(LocalDateTime.now());

        ConsumptionLog savedLog = consumptionLogRepository.save(log);
        return ResponseEntity.ok(savedLog);
    }
}
