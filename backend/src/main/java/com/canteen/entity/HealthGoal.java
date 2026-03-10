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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType goalType;

    @Column(nullable = false)
    private Integer targetDailyCalories;

    @Column(nullable = false)
    private Double targetDailyProtein;

    // Optional fields for tracking metrics
    private Double currentWeight;
    private Double targetWeight;
}
