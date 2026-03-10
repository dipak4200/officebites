package com.canteen.repository;

import com.canteen.entity.ConsumptionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsumptionLogRepository extends JpaRepository<ConsumptionLog, Long> {
    List<ConsumptionLog> findByConsumptionDateBetween(LocalDateTime start, LocalDateTime end);
    List<ConsumptionLog> findByEmployeeId(Long employeeId);
}
