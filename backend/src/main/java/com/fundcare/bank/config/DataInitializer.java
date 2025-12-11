package com.fundcare.bank.config;

import com.fundcare.bank.model.Role;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.fundcare.bank.service.AccountService accountService;

    @Override
    public void run(String... args) throws Exception {
        // Seed or Update Admin User
        User admin = userRepository.findByEmail("omkarchoramale03@gmail.com").orElse(new User());

        admin.setFullName("Omkar Choramale");
        admin.setEmail("omkarchoramale03@gmail.com");
        admin.setPassword(passwordEncoder.encode("Omkar@2003"));
        admin.setRole(Role.ADMIN);
        admin.setActive(true);

        userRepository.save(admin);
        System.out.println("Admin user seeded/updated: omkarchoramale03@gmail.com");

        // Seed 25 Realistic Users
        if (userRepository.count() < 26) { // Admin + 25 users
            String[] firstNames = { "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
                    "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas",
                    "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew" };
            String[] lastNames = { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor",
                    "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris" };

            for (int i = 0; i < 25; i++) {
                String firstName = firstNames[i % firstNames.length];
                String lastName = lastNames[i % lastNames.length];
                String fullName = firstName + " " + lastName;
                String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + (i + 1) + "@example.com";

                if (!userRepository.existsByEmail(email)) {
                    User user = new User();
                    user.setFullName(fullName);
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode("User@123"));
                    user.setRole(Role.USER);
                    user.setActive(true);
                    User savedUser = userRepository.save(user);

                    // Create default Savings account
                    accountService.createAccount(savedUser.getId(), com.fundcare.bank.model.AccountType.SAVINGS,
                            java.math.BigDecimal.valueOf(1000.00 + (i * 100))); // Varied balance

                    System.out.println("Seeded user: " + email);
                }
            }
        }
    }
}
