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

    @Column(nullable = false)
    private Integer targetDailyCalories;

    @Column(nullable = false)
    private Double targetDailyProtein;

    // Optional fields for tracking metrics
    @jakarta.validation.constraints.DecimalMin(value = "20.0", message = "Weight must be at least 20kg")
    @jakarta.validation.constraints.DecimalMax(value = "300.0", message = "Weight cannot exceed 300kg")
    private Double currentWeight;

    @jakarta.validation.constraints.DecimalMin(value = "20.0", message = "Target weight must be at least 20kg")
    @jakarta.validation.constraints.DecimalMax(value = "300.0", message = "Target weight cannot exceed 300kg")
    private Double targetWeight;

    // Added for BMR calculation
    @jakarta.validation.constraints.DecimalMin(value = "50.0", message = "Height must be at least 50cm")
    @jakarta.validation.constraints.DecimalMax(value = "300.0", message = "Height cannot exceed 300cm")
    private Double height;

    @jakarta.validation.constraints.Min(value = 10, message = "Age must be at least 10")
    @jakarta.validation.constraints.Max(value = 120, message = "Age cannot exceed 120")
    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;
}
