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

        User savedAdmin = userRepository.save(admin);
        System.out.println("Admin user seeded/updated: omkarchoramale03@gmail.com");

        // Ensure Admin has an account and data for testing
        if (accountService.getUserAccounts(savedAdmin.getId()).isEmpty()) {
            com.fundcare.bank.model.Account adminAccount = accountService.createAccount(savedAdmin.getId(),
                    com.fundcare.bank.model.AccountType.SAVINGS,
                    java.math.BigDecimal.valueOf(50000.00));
            seedTransactions(adminAccount);
            seedInvestments(savedAdmin);
        }

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
                    com.fundcare.bank.model.Account account = accountService.createAccount(savedUser.getId(),
                            com.fundcare.bank.model.AccountType.SAVINGS,
                            java.math.BigDecimal.valueOf(1000.00 + (i * 100))); // Varied balance

                    // Seed Transactions for this account
                    seedTransactions(account);

                    // Seed Investments for this user
                    seedInvestments(savedUser);

                    System.out.println("Seeded user: " + email);
                }
            }

            // Seed data for Admin as well if they have an account (Admin usually doesn't
            // have bank account in this logic but let's check)
            // Ideally Admin is just an admin, but for demo purposes let's give Admin a user
            // account too or just rely on the "James Smith" user for demo.
            // Let's ensure James Smith (user 1) has rich data.
        }
    }

    @Autowired
    private com.fundcare.bank.repository.TransactionRepository transactionRepository;

    @Autowired
    private com.fundcare.bank.repository.InvestmentRepository investmentRepository;

    private void seedTransactions(com.fundcare.bank.model.Account account) {
        // Add some deposits
        for (int i = 0; i < 5; i++) {
            com.fundcare.bank.model.Transaction t = new com.fundcare.bank.model.Transaction();
            t.setReceiverAccount(account); // Deposit to this account
            t.setAmount(java.math.BigDecimal.valueOf(500 + (Math.random() * 2000)));
            t.setType(com.fundcare.bank.model.TransactionType.DEPOSIT);
            t.setDescription("Salary/Deposit " + (i + 1));
            t.setTimestamp(java.time.LocalDateTime.now().minusDays(i * 5));
            t.setStatus("SUCCESS");
            transactionRepository.save(t);
        }

        // Add some withdrawals/expenses
        for (int i = 0; i < 8; i++) {
            com.fundcare.bank.model.Transaction t = new com.fundcare.bank.model.Transaction();
            t.setSenderAccount(account); // Withdraw from this account
            t.setAmount(java.math.BigDecimal.valueOf(50 + (Math.random() * 200)));
            t.setType(com.fundcare.bank.model.TransactionType.WITHDRAWAL); // Or BILL_PAYMENT
            t.setDescription("Purchase/Bill " + (i + 1));
            t.setTimestamp(java.time.LocalDateTime.now().minusDays(i * 3));
            t.setStatus("SUCCESS");
            transactionRepository.save(t);
        }
    }

    private void seedInvestments(User user) {
        String[] names = { "Apple Inc.", "Alphabet Inc.", "Tesla Inc.", "Amazon.com", "Microsoft" };

        for (int i = 0; i < 3; i++) {
            com.fundcare.bank.model.Investment inv = new com.fundcare.bank.model.Investment();
            inv.setUser(user);
            inv.setName(names[i]);
            // Symbol is not in model, skipping
            inv.setType(com.fundcare.bank.model.InvestmentType.STOCK);

            java.math.BigDecimal units = java.math.BigDecimal.valueOf(10 + (Math.random() * 50));
            java.math.BigDecimal purchasePrice = java.math.BigDecimal.valueOf(100 + (Math.random() * 500));
            java.math.BigDecimal currentPrice = purchasePrice.multiply(java.math.BigDecimal.valueOf(1.1)); // 10% gain

            inv.setUnits(units);
            inv.setInvestedAmount(purchasePrice.multiply(units));
            inv.setCurrentValue(currentPrice.multiply(units));

            inv.setPurchaseDate(java.time.LocalDate.now().minusMonths(i + 1));
            investmentRepository.save(inv);
        }
    }
}
