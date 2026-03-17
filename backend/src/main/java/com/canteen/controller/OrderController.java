package com.canteen.controller;

import com.canteen.entity.Order;
import com.canteen.entity.OrderStatus;
import com.canteen.entity.FoodItem;
import com.canteen.entity.User;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;

    @PostMapping("/{employeeId}/order/{foodItemId}")
    public ResponseEntity<Order> placeOrder(
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Order order = new Order();
        order.setEmployee(employeeOpt.get());
        order.setFoodItem(foodOpt.get());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        
        // Generate a 6-digit OTC
        Random random = new Random();
        int otcNumber = 100000 + random.nextInt(900000);
        order.setOneTimeCode(String.valueOf(otcNumber));

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/{employeeId}/orders")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(orderRepository.findByEmployeeIdOrderByOrderDateDesc(employeeId));
    }

    @GetMapping("/{employeeId}/streak")
    public ResponseEntity<Map<String, Object>> getStreak(@PathVariable Long employeeId) {
        // Simplified streak logic: count the number of consecutive days with at least one DELIVERED order
        // In a real app, this would check calories against the health goal
        List<Order> deliveredOrders = orderRepository.findByEmployeeIdAndStatusOrderByOrderDateDesc(employeeId, OrderStatus.DELIVERED);
        
        if (deliveredOrders.isEmpty()) {
            return ResponseEntity.ok(Map.of("streak", 0));
        }

        int streak = 0;
        LocalDateTime currentDate = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        
        Set<LocalDateTime> uniqueDays = new HashSet<>();
        for (Order o : deliveredOrders) {
            uniqueDays.add(o.getDeliveryDate().truncatedTo(ChronoUnit.DAYS));
        }

        // Count backwards from today
        while (uniqueDays.contains(currentDate) || uniqueDays.contains(currentDate.minusDays(1)) && streak == 0) {
            if (uniqueDays.contains(currentDate)) {
                streak++;
            }
            currentDate = currentDate.minusDays(1);
        }
        
        // If today is missed but yesterday was hit it still counts as an ongoing streak of previous days
        if (streak == 0 && uniqueDays.contains(LocalDateTime.now().truncatedTo(ChronoUnit.DAYS).minusDays(1))) {
            currentDate = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS).minusDays(1);
            while (uniqueDays.contains(currentDate)) {
                streak++;
                currentDate = currentDate.minusDays(1);
            }
        }

        return ResponseEntity.ok(Map.of("streak", streak));
    }
}
