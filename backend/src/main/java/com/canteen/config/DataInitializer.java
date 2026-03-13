package com.canteen.config;

import com.canteen.entity.Role;
import com.canteen.entity.User;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            // Create default ADMIN
            Optional<User> adminOpt = userRepository.findByUsername("admin");
            if (adminOpt.isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setFullName("Default Admin");
                admin.setEmail("admin@officebites.com");
                userRepository.save(admin);
                System.out.println("✅ Default admin created: admin / admin123");
            }

            // Create sample VENDOR
            Optional<User> vendorOpt = userRepository.findByUsername("vendor1");
            if (vendorOpt.isEmpty()) {
                User vendor = new User();
                vendor.setUsername("vendor1");
                vendor.setPassword(passwordEncoder.encode("password123"));
                vendor.setRole(Role.VENDOR);
                vendor.setFullName("Fresh Bites Vendor");
                vendor.setEmail("vendor1@officebites.com");
                userRepository.save(vendor);
                System.out.println("✅ Default vendor created: vendor1 / password123");
            }

            // Create sample EMPLOYEE
            Optional<User> empOpt = userRepository.findByUsername("john");
            if (empOpt.isEmpty()) {
                User emp = new User();
                emp.setUsername("john");
                emp.setPassword(passwordEncoder.encode("password123"));
                emp.setRole(Role.EMPLOYEE);
                emp.setFullName("John Doe");
                emp.setEmail("john@company.com");
                userRepository.save(emp);
                System.out.println("✅ Default employee created: john / password123");
            }
        };
    }
}
