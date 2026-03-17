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
                admin.setPassword(passwordEncoder.encode("Password@123"));
                admin.setRole(Role.ADMIN);
                admin.setFullName("Default Admin");
                admin.setEmail("admin@officebites.com");
                userRepository.save(admin);
                System.out.println("✅ Default admin created: admin / Password@123");
            }

            // Create sample VENDOR
            Optional<User> vendorOpt = userRepository.findByUsername("vendor1");
            if (vendorOpt.isEmpty()) {
                User vendor = new User();
                vendor.setUsername("vendor1");
                vendor.setPassword(passwordEncoder.encode("Password@123"));
                vendor.setRole(Role.VENDOR);
                vendor.setFullName("Fresh Bites Vendor");
                vendor.setEmail("vendor1@officebites.com");
                userRepository.save(vendor);
                System.out.println("✅ Default vendor created: vendor1 / Password@123");
            }

            // Create sample EMPLOYEE
            Optional<User> empOpt = userRepository.findByUsername("john");
            if (empOpt.isEmpty()) {
                User emp = new User();
                emp.setUsername("john");
                emp.setPassword(passwordEncoder.encode("Password@123"));
                emp.setRole(Role.EMPLOYEE);
                emp.setFullName("John Doe");
                emp.setEmail("john@company.com");
                userRepository.save(emp);
                System.out.println("✅ Default employee created: john / Password@123");
            }

            // Ensure all users have Password@123
            java.util.List<User> allUsers = userRepository.findAll();
            for (User u : allUsers) {
                if (!passwordEncoder.matches("Password@123", u.getPassword())) {
                    u.setPassword(passwordEncoder.encode("Password@123"));
                    userRepository.save(u);
                    System.out.println("✅ Password updated to Password@123 for user: " + u.getUsername());
                }
            }
        };
    }
}
