package com.canteen.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "health_goals")
@Data
public class HealthGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private User employee;

    @jakarta.validation.constraints.NotNull(message = "Goal type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType goalType;

    @jakarta.validation.constraints.NotNull(message = "Target daily calories is required")
    @jakarta.validation.constraints.Min(value = 500, message = "Target calories must be at least 500")
    @jakarta.validation.constraints.Max(value = 10000, message = "Target calories cannot exceed 10000")
    @Column(nullable = false)
    private Integer targetDailyCalories;

    @jakarta.validation.constraints.NotNull(message = "Target daily protein is required")
    @jakarta.validation.constraints.DecimalMin(value = "10.0", message = "Target protein must be at least 10g")
    @jakarta.validation.constraints.DecimalMax(value = "500.0", message = "Target protein cannot exceed 500g")
    @Column(nullable = false)
    private Double targetDailyProtein;

    // Optional fields for tracking metrics
    @jakarta.validation.constraints.DecimalMin(value = "20.0", message = "Weight must be at least 20kg")
    @jakarta.validation.constraints.DecimalMax(value = "300.0", message = "Weight cannot exceed 300kg")
    private Double currentWeight;

    @jakarta.validation.constraints.DecimalMin(value = "20.0", message = "Target weight must be at least 20kg")
    @jakarta.validation.constraints.DecimalMax(value = "300.0", message = "Target weight cannot exceed 300kg")
    private Double targetWeight;
}
