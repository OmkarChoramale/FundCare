package com.fundcare.bank.controller;

import com.fundcare.bank.model.*;
import com.fundcare.bank.repository.*;
import com.fundcare.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @PostMapping("/seed-advanced")
    public ResponseEntity<?> seedAdvanced() {
        Random random = new Random();
        List<User> users = new ArrayList<>();

        // 1. Ensure 30 Users
        String[] firstNames = { "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
                "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas",
                "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew" };
        String[] lastNames = { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor",
                "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris" };

        for (int i = 0; i < 30; i++) {
            String firstName = firstNames[i % firstNames.length];
            String lastName = lastNames[i % lastNames.length];
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + (i + 1) + "@example.com";

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setFullName(firstName + " " + lastName);
                user.setEmail(email);
                user.setRole(Role.USER);
                user.setActive(true);
            }
            // Always reset password for testing
            user.setPassword(passwordEncoder.encode("password"));
            user = userRepository.save(user);
            users.add(user);
        }

        // Ensure Admin User
        User admin = userRepository.findByEmail("admin@example.com").orElse(new User());
        if (admin.getId() == null) {
            admin.setFullName("Super Admin");
            admin.setEmail("admin@example.com");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
        }
        admin.setPassword(passwordEncoder.encode("admin"));
        userRepository.save(admin);

        // 2. Seed Assets for Each User
        for (User user : users) {
            // Accounts
            if (accountRepository.findByUser(user).isEmpty()) {
                accountService.createAccount(user.getId(), AccountType.SAVINGS,
                        BigDecimal.valueOf(random.nextInt(50000) + 5000));
                accountService.createAccount(user.getId(), AccountType.CURRENT,
                        BigDecimal.valueOf(random.nextInt(100000) + 10000));
            }

            // Cards
            if (cardRepository.findByUser(user).isEmpty()) {
                // Debit Card
                Card debit = new Card();
                debit.setUser(user);
                debit.setType(CardType.DEBIT);
                debit.setCardNumber("4" + (100000000000000L + random.nextLong(899999999999999L)));
                debit.setCardHolderName(user.getFullName().toUpperCase());
                debit.setExpiryDate("12/28");
                debit.setCvv(String.valueOf(100 + random.nextInt(899)));
                debit.setLimitAmount(BigDecimal.valueOf(50000));
                debit.setStatus("ACTIVE");
                cardRepository.save(debit);

                // Credit Card
                Card credit = new Card();
                credit.setUser(user);
                credit.setType(CardType.CREDIT);
                credit.setCardNumber("5" + (100000000000000L + random.nextLong(899999999999999L)));
                credit.setCardHolderName(user.getFullName().toUpperCase());
                credit.setExpiryDate("10/29");
                credit.setCvv(String.valueOf(100 + random.nextInt(899)));
                credit.setLimitAmount(BigDecimal.valueOf(200000));
                credit.setUsedAmount(BigDecimal.valueOf(random.nextInt(50000)));
                credit.setStatus("ACTIVE");
                cardRepository.save(credit);
            }

            // Investments
            if (investmentRepository.findByUser(user).isEmpty()) {
                Investment inv1 = new Investment();
                inv1.setUser(user);
                inv1.setType(InvestmentType.MUTUAL_FUND);
                inv1.setName("Blue Chip Growth Fund");
                inv1.setInvestedAmount(BigDecimal.valueOf(random.nextInt(20000) + 5000));
                inv1.setCurrentValue(inv1.getInvestedAmount().multiply(BigDecimal.valueOf(1.15)));
                inv1.setPurchaseDate(LocalDate.now().minusMonths(random.nextInt(12)));
                investmentRepository.save(inv1);

                Investment inv2 = new Investment();
                inv2.setUser(user);
                inv2.setType(InvestmentType.STOCK);
                inv2.setName("Tech Giants ETF");
                inv2.setInvestedAmount(BigDecimal.valueOf(random.nextInt(50000) + 10000));
                inv2.setCurrentValue(inv2.getInvestedAmount().multiply(BigDecimal.valueOf(1.08)));
                inv2.setPurchaseDate(LocalDate.now().minusMonths(random.nextInt(6)));
                investmentRepository.save(inv2);
            }

            // Loans
            if (loanRepository.findByUser(user).isEmpty()) {
                Loan loan = new Loan();
                loan.setUser(user);
                loan.setType(LoanType.PERSONAL_LOAN);
                loan.setAmount(BigDecimal.valueOf(random.nextInt(500000) + 50000));
                loan.setInterestRate(BigDecimal.valueOf(10.5));
                loan.setTenureMonths(24);
                loan.setStatus(random.nextBoolean() ? "APPROVED" : "PENDING");
                loan.setApplicationDate(LocalDate.now().minusDays(random.nextInt(30)));
                loanRepository.save(loan);
            }
        }

        // 3. Generate 600 Transactions
        List<Account> accounts = accountRepository.findAll();
        for (int i = 0; i < 600; i++) {
            Account sender = accounts.get(random.nextInt(accounts.size()));
            Account receiver = accounts.get(random.nextInt(accounts.size()));

            // Avoid self-transfer for third party
            while (sender.getId().equals(receiver.getId())) {
                receiver = accounts.get(random.nextInt(accounts.size()));
            }

            Transaction transaction = new Transaction();
            transaction.setTimestamp(LocalDateTime.now().minusDays(random.nextInt(180)).minusHours(random.nextInt(24)));

            int typeRoll = random.nextInt(100);
            if (typeRoll < 40) {
                // Transfer
                transaction.setSenderAccount(sender);
                transaction.setReceiverAccount(receiver);
                transaction.setType(TransactionType.THIRD_PARTY_TRANSFER);
                transaction.setAmount(BigDecimal.valueOf(random.nextInt(5000) + 100));
                transaction.setDescription("Transfer to " + receiver.getUser().getFullName());
                transaction.setStatus("SUCCESS");
            } else if (typeRoll < 70) {
                // Bill Payment
                transaction.setSenderAccount(sender);
                transaction.setType(TransactionType.BILL_PAYMENT);
                transaction.setAmount(BigDecimal.valueOf(random.nextInt(2000) + 50));
                transaction.setDescription("Bill Payment: Electricity");
                transaction.setStatus("SUCCESS");
            } else {
                // Deposit
                transaction.setReceiverAccount(sender); // Sender is receiver for deposit logic here
                transaction.setType(TransactionType.DEPOSIT);
                transaction.setAmount(BigDecimal.valueOf(random.nextInt(10000) + 1000));
                transaction.setDescription("Cash Deposit");
                transaction.setStatus("SUCCESS");
            }

            transaction.setPaymentMode(PaymentMode.values()[random.nextInt(PaymentMode.values().length)]);
            transactionRepository.save(transaction);
        }

        return ResponseEntity.ok(Map.of("message", "Advanced seeding completed successfully"));
    }

    @PostMapping("/seed-stress")
    public ResponseEntity<?> seedStress() {
        Random random = new Random();
        List<User> users = new ArrayList<>();
        String[] domains = { "Technology", "Healthcare", "Real Estate", "Energy", "Automotive" };

        // 1. Create 10 Stress Test Users
        for (int i = 1; i <= 10; i++) {
            String email = "stress.user" + i + "@example.com";
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setFullName("Stress User " + i);
                user.setEmail(email);
                user.setRole(Role.USER);
                user.setActive(true);
                user.setPassword(passwordEncoder.encode("password"));
                user = userRepository.save(user);
            }
            users.add(user);

            // Ensure Account
            if (accountRepository.findByUser(user).isEmpty()) {
                accountService.createAccount(user.getId(), AccountType.SAVINGS, BigDecimal.valueOf(100000));
            }

            // Ensure Card
            if (cardRepository.findByUser(user).isEmpty()) {
                Card card = new Card();
                card.setUser(user);
                card.setType(CardType.DEBIT);
                card.setCardNumber("4" + (100000000000000L + random.nextLong(899999999999999L)));
                card.setCardHolderName(user.getFullName().toUpperCase());
                card.setExpiryDate("12/30");
                card.setCvv("123");
                card.setLimitAmount(BigDecimal.valueOf(50000));
                card.setStatus("ACTIVE");
                cardRepository.save(card);
            }

            // Ensure Diverse Investments
            if (investmentRepository.findByUser(user).isEmpty()) {
                for (int j = 0; j < 3; j++) {
                    Investment inv = new Investment();
                    inv.setUser(user);
                    inv.setType(InvestmentType.values()[random.nextInt(InvestmentType.values().length)]);
                    inv.setName(domains[random.nextInt(domains.length)] + " Fund " + (j + 1));
                    inv.setInvestedAmount(BigDecimal.valueOf(random.nextInt(50000) + 5000));
                    inv.setCurrentValue(
                            inv.getInvestedAmount().multiply(BigDecimal.valueOf(1.0 + (random.nextDouble() * 0.2))));
                    inv.setPurchaseDate(LocalDate.now().minusMonths(random.nextInt(12)));
                    investmentRepository.save(inv);
                }
            }
        }

        // 2. Generate 500 Transactions (Deposits & Withdrawals)
        List<Account> allAccounts = accountRepository.findAll();
        // Filter to only include accounts of our new users to ensure they get the
        // traffic
        List<Account> stressAccounts = allAccounts.stream()
                .filter(a -> a.getUser().getEmail().startsWith("stress.user"))
                .toList();

        for (int i = 0; i < 500; i++) {
            Account account = stressAccounts.get(random.nextInt(stressAccounts.size()));
            Transaction transaction = new Transaction();
            transaction.setTimestamp(LocalDateTime.now().minusHours(random.nextInt(48))); // Recent transactions

            boolean isDeposit = random.nextBoolean();
            if (isDeposit) {
                transaction.setReceiverAccount(account);
                transaction.setType(TransactionType.DEPOSIT);
                transaction.setAmount(BigDecimal.valueOf(random.nextInt(5000) + 100));
                transaction.setDescription("Stress Test Deposit");
            } else {
                transaction.setSenderAccount(account);
                transaction.setType(TransactionType.BILL_PAYMENT); // Acts as withdrawal
                transaction.setAmount(BigDecimal.valueOf(random.nextInt(2000) + 50));
                transaction.setDescription("Stress Test Withdrawal");
            }
            transaction.setStatus("SUCCESS");
            transaction.setPaymentMode(PaymentMode.UPI);
            transactionRepository.save(transaction);
        }

        return ResponseEntity
                .ok(Map.of("message", "Stress test seeding completed: 10 Users, 500 Transactions, Diverse Assets."));
    }

    @GetMapping("/check-stress-data")
    public ResponseEntity<?> checkStressData() {
        long userCount = userRepository.count();
        long accountCount = accountRepository.count();
        long cardCount = cardRepository.count();
        long investmentCount = investmentRepository.count();
        long transactionCount = transactionRepository.count();

        return ResponseEntity.ok(Map.of(
                "users", userCount,
                "accounts", accountCount,
                "cards", cardCount,
                "investments", investmentCount,
                "transactions", transactionCount));
    }

    @GetMapping("/debug-user-data")
    public ResponseEntity<?> debugUserData(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Account> accounts = accountService.getUserAccounts(user.getId());
        List<Card> cards = cardRepository.findByUser(user);
        List<Investment> investments = investmentRepository.findByUser(user);

        return ResponseEntity.ok(Map.of(
                "user", user,
                "accounts", accounts,
                "cards", cards,
                "investments", investments));
    }

    @GetMapping("/run-operations")
    public ResponseEntity<?> runOperations(@RequestParam(defaultValue = "100") int count) {
        Random random = new Random();
        List<Account> accounts = accountRepository.findAll();
        int successCount = 0;

        for (int i = 0; i < count; i++) {
            try {
                Account account = accounts.get(random.nextInt(accounts.size()));
                Transaction transaction = new Transaction();
                transaction.setTimestamp(LocalDateTime.now());
                transaction.setStatus("SUCCESS");
                transaction.setPaymentMode(PaymentMode.values()[random.nextInt(PaymentMode.values().length)]);

                int typeRoll = random.nextInt(100);
                if (typeRoll < 33) {
                    // Deposit
                    transaction.setReceiverAccount(account);
                    transaction.setType(TransactionType.DEPOSIT);
                    transaction.setAmount(BigDecimal.valueOf(random.nextInt(5000) + 100));
                    transaction.setDescription("Agent Deposit");
                } else if (typeRoll < 66) {
                    // Withdrawal (Bill Payment)
                    transaction.setSenderAccount(account);
                    transaction.setType(TransactionType.BILL_PAYMENT);
                    transaction.setAmount(BigDecimal.valueOf(random.nextInt(2000) + 50));
                    transaction.setDescription("Agent Bill Payment");
                } else {
                    // Transfer
                    Account receiver = accounts.get(random.nextInt(accounts.size()));
                    while (receiver.getId().equals(account.getId())) {
                        receiver = accounts.get(random.nextInt(accounts.size()));
                    }
                    transaction.setSenderAccount(account);
                    transaction.setReceiverAccount(receiver);
                    transaction.setType(TransactionType.THIRD_PARTY_TRANSFER);
                    transaction.setAmount(BigDecimal.valueOf(random.nextInt(3000) + 100));
                    transaction.setDescription("Agent Transfer");
                }
                transactionRepository.save(transaction);
                successCount++;
            } catch (Exception e) {
                // Ignore failed transactions in bulk run
            }
        }
        return ResponseEntity.ok(Map.of("message", "Executed " + successCount + " operations successfully."));
    }
}
