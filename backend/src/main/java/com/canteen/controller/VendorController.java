package com.canteen.controller;

import com.canteen.entity.FoodItem;
import com.canteen.entity.Role;
import com.canteen.entity.User;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    @PostMapping("/food-items")
    public ResponseEntity<?> addFoodItem(Authentication auth, @RequestBody FoodItem foodItem) {
        Optional<User> vendorOpt = userRepository.findByUsername(auth.getName());
        if (vendorOpt.isEmpty() || vendorOpt.get().getRole() != Role.VENDOR) {
            return ResponseEntity.status(403).body("Access denied");
        }
        foodItem.setVendor(vendorOpt.get());
        FoodItem savedItem = foodItemRepository.save(foodItem);
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping("/food-items")
    public ResponseEntity<List<FoodItem>> getMyFoodItems(Authentication auth) {
        Optional<User> vendorOpt = userRepository.findByUsername(auth.getName());
        if (vendorOpt.isEmpty()) return ResponseEntity.status(403).build();
        List<FoodItem> items = foodItemRepository.findByVendorId(vendorOpt.get().getId());
        return ResponseEntity.ok(items);
    }

    @PutMapping("/food-items/{id}")
    public ResponseEntity<?> updateFoodItem(Authentication auth,
                                             @PathVariable Long id,
                                             @RequestBody FoodItem updated) {
        Optional<User> vendorOpt = userRepository.findByUsername(auth.getName());
        if (vendorOpt.isEmpty()) return ResponseEntity.status(403).build();

        Optional<FoodItem> itemOpt = foodItemRepository.findById(id);
        if (itemOpt.isEmpty()) return ResponseEntity.notFound().build();

        FoodItem item = itemOpt.get();
        if (!item.getVendor().getId().equals(vendorOpt.get().getId())) {
            return ResponseEntity.status(403).body("Not your food item");
        }

        item.setName(updated.getName());
        item.setDescription(updated.getDescription());
        item.setPrice(updated.getPrice());
        item.setCalories(updated.getCalories());
        item.setProtein(updated.getProtein());
        item.setCarbohydrates(updated.getCarbohydrates());
        item.setFats(updated.getFats());
        item.setIsActive(updated.getIsActive());
        return ResponseEntity.ok(foodItemRepository.save(item));
    }

    @DeleteMapping("/food-items/{id}")
    public ResponseEntity<?> deleteFoodItem(Authentication auth, @PathVariable Long id) {
        Optional<User> vendorOpt = userRepository.findByUsername(auth.getName());
        if (vendorOpt.isEmpty()) return ResponseEntity.status(403).build();
        Optional<FoodItem> itemOpt = foodItemRepository.findById(id);
        if (itemOpt.isEmpty()) return ResponseEntity.notFound().build();
        if (!itemOpt.get().getVendor().getId().equals(vendorOpt.get().getId())) {
            return ResponseEntity.status(403).body("Not your food item");
        }
        foodItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
