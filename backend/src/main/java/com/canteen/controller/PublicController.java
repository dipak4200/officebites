package com.canteen.controller;

import com.canteen.entity.FoodItem;
import com.canteen.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final FoodItemRepository foodItemRepository;

    @GetMapping("/food-items")
    public ResponseEntity<List<FoodItem>> getAllActiveFoodItems() {
        List<FoodItem> active = foodItemRepository.findAll().stream()
                .filter(FoodItem::getIsActive)
                .toList();
        return ResponseEntity.ok(active);
    }
}
