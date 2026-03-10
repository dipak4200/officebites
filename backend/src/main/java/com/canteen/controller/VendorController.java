package com.canteen.controller;

import com.canteen.entity.FoodItem;
import com.canteen.entity.User;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    @PostMapping("/{vendorId}/food-items")
    public ResponseEntity<FoodItem> addFoodItem(@PathVariable Long vendorId, @RequestBody FoodItem foodItem) {
        Optional<User> vendorOpt = userRepository.findById(vendorId);
        if (vendorOpt.isEmpty() || vendorOpt.get().getRole() != com.canteen.entity.Role.VENDOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        foodItem.setVendor(vendorOpt.get());
        FoodItem savedItem = foodItemRepository.save(foodItem);
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping("/{vendorId}/food-items")
    public ResponseEntity<List<FoodItem>> getVendorFoodItems(@PathVariable Long vendorId) {
        List<FoodItem> items = foodItemRepository.findByVendorId(vendorId);
        return ResponseEntity.ok(items);
    }
}
