package com.fundcare.bank.service;

import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.AccountRepository;
import com.fundcare.bank.repository.LoanRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AccountRepository accountRepository;

        @Autowired
        private LoanRepository loanRepository;

        @Autowired
        private AuditLogService auditLogService;

        @Autowired
        private NotificationService notificationService;

        public List<User> getAllUsers() {
                return userRepository.findAll();
        }

        public User toggleUserStatus(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setActive(!user.isActive());
                User savedUser = userRepository.save(user);

                String action = user.isActive() ? "UNBLOCKED" : "BLOCKED";
                auditLogService.log("ADMIN_ACTION", "User " + user.getEmail() + " was " + action, null);

                // Notify User
                String title = user.isActive() ? "Account Unblocked" : "Account Blocked";
                String message = user.isActive() ? "Your account has been reactivated by the administrator."
                                : "Your account has been blocked by the administrator. Please contact support.";
                String type = user.isActive() ? "SUCCESS" : "ERROR";
                notificationService.createNotification(user, title, message, type);

                return savedUser;
        }

        public void deleteUser(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Log before deletion
                auditLogService.log("ADMIN_ACTION", "User " + user.getEmail() + " was DELETED", null);

                userRepository.delete(user);
        }

        @Autowired
        private com.fundcare.bank.repository.TransactionRepository transactionRepository;

        @Autowired
        private com.fundcare.bank.repository.CardRepository cardRepository;

        @Autowired
        private com.fundcare.bank.repository.InvestmentRepository investmentRepository;

        @Autowired
        private com.fundcare.bank.repository.ServiceRequestRepository serviceRequestRepository;

        public Map<String, Object> getSystemStats() {
                long totalUsers = userRepository.count();
                long totalAccounts = accountRepository.count();
                long totalLoans = loanRepository.count();

                // Calculate total deposits (Current Month)
                BigDecimal totalDeposits = transactionRepository
                                .sumAmountByTypeAndCurrentMonth(com.fundcare.bank.model.TransactionType.DEPOSIT);
                if (totalDeposits == null)
                        totalDeposits = BigDecimal.ZERO;

                // Calculate total withdrawals (Current Month) - Sum of Transfers and Bill
                // Payments
                BigDecimal totalTransfers = transactionRepository
                                .sumAmountByTypeAndCurrentMonth(
                                                com.fundcare.bank.model.TransactionType.THIRD_PARTY_TRANSFER);
                BigDecimal totalBills = transactionRepository
                                .sumAmountByTypeAndCurrentMonth(com.fundcare.bank.model.TransactionType.BILL_PAYMENT);
                BigDecimal totalWithdrawals = (totalTransfers == null ? BigDecimal.ZERO : totalTransfers)
                                .add(totalBills == null ? BigDecimal.ZERO : totalBills);

                long blockedUsers = userRepository.findAll().stream().filter(u -> !u.isActive()).count();
                long loansApproved = loanRepository.findAll().stream().filter(l -> "APPROVED".equals(l.getStatus()))
                                .count();

                long paidLoans = loanRepository.findAll().stream().filter(l -> "PAID".equals(l.getStatus())).count();

                // New Accounts (Current Month)
                java.time.YearMonth currentMonth = java.time.YearMonth.now();
                long newAccounts = accountRepository.findAll().stream()
                                .filter(a -> java.time.YearMonth.from(a.getCreatedAt()).equals(currentMonth))
                                .count();

                Map<String, Object> stats = new HashMap<>();
                stats.put("totalUsers", totalUsers);
                stats.put("totalAccounts", totalAccounts);
                stats.put("totalLoans", totalLoans);
                stats.put("totalDeposits", totalDeposits);
                stats.put("totalWithdrawals", totalWithdrawals);
                stats.put("blockedUsers", blockedUsers);
                stats.put("loansApproved", loansApproved);
                stats.put("paidLoans", paidLoans);
                stats.put("newAccounts", newAccounts);
                stats.put("pendingRequests", serviceRequestRepository.count());

                // Transaction Trends (Last 30 Days)
                Map<String, Integer> transactionTrends = new java.util.LinkedHashMap<>();
                List<com.fundcare.bank.model.Transaction> allTransactions = transactionRepository.findAll();
                java.time.LocalDate today = java.time.LocalDate.now();
                for (int i = 29; i >= 0; i--) {
                        java.time.LocalDate date = today.minusDays(i);
                        String dateStr = date.toString();
                        long count = allTransactions.stream()
                                        .filter(t -> t.getTimestamp().toLocalDate().equals(date))
                                        .count();
                        transactionTrends.put(dateStr, (int) count);
                }
                stats.put("transactionTrends", transactionTrends);

                // Loan Distribution
                Map<String, Long> loanDistribution = loanRepository.findAll().stream()
                                .collect(java.util.stream.Collectors.groupingBy(
                                                l -> l.getType().name(),
                                                java.util.stream.Collectors.counting()));
                stats.put("loanDistribution", loanDistribution);

                // User Growth (Last 6 Months)
                Map<String, Long> userGrowth = userRepository.findAll().stream()
                                .collect(java.util.stream.Collectors.groupingBy(
                                                u -> u.getCreatedAt().getMonth().name(),
                                                java.util.stream.Collectors.counting()));
                stats.put("userGrowth", userGrowth);

                return stats;
        }

        public List<com.fundcare.bank.model.Loan> getPendingLoans() {
                return loanRepository.findAll().stream()
                                .filter(l -> "PENDING".equals(l.getStatus()))
                                .collect(java.util.stream.Collectors.toList());
        }

        public com.fundcare.bank.model.Loan approveLoan(Long loanId) {
                com.fundcare.bank.model.Loan loan = loanRepository.findById(loanId)
                                .orElseThrow(() -> new RuntimeException("Loan not found"));

                if (!"PENDING".equals(loan.getStatus())) {
                        throw new RuntimeException("Loan is not pending");
                }

                loan.setStatus("APPROVED");
                com.fundcare.bank.model.Loan savedLoan = loanRepository.save(loan);

                // Credit the loan amount to the user's account
                // Assuming user has at least one account, pick the first one or specific one if
                // linked
                // For simplicity, find first account of user
                com.fundcare.bank.model.Account account = accountRepository.findByUserId(loan.getUser().getId())
                                .stream()
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("User has no account to credit loan"));

                account.setBalance(account.getBalance().add(loan.getAmount()));
                accountRepository.save(account);

                // Create Transaction Record for Loan Credit
                com.fundcare.bank.model.Transaction transaction = new com.fundcare.bank.model.Transaction();
                transaction.setReceiverAccount(account);
                transaction.setAmount(loan.getAmount());
                transaction.setType(com.fundcare.bank.model.TransactionType.DEPOSIT); // Treat as deposit
                transaction.setDescription("Loan Disbursal: " + loan.getType());
                transaction.setStatus("SUCCESS");
                transaction.setTimestamp(java.time.LocalDateTime.now());
                transactionRepository.save(transaction);

                notificationService.createNotification(loan.getUser(), "Loan Approved",
                                "Your loan application for " + loan.getType() + " has been approved.", "SUCCESS");

                return savedLoan;
        }

        public com.fundcare.bank.model.Loan rejectLoan(Long loanId) {
                com.fundcare.bank.model.Loan loan = loanRepository.findById(loanId)
                                .orElseThrow(() -> new RuntimeException("Loan not found"));

                if (!"PENDING".equals(loan.getStatus())) {
                        throw new RuntimeException("Loan is not pending");
                }

                loan.setStatus("REJECTED");
                com.fundcare.bank.model.Loan savedLoan = loanRepository.save(loan);

                notificationService.createNotification(loan.getUser(), "Loan Rejected",
                                "Your loan application for " + loan.getType() + " has been rejected.", "ERROR");

                return savedLoan;
        }

        public Map<String, Object> getUserFullDetails(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<com.fundcare.bank.model.Account> accounts = accountRepository.findByUserId(userId);

                // Fetch recent transactions for all user accounts
                List<com.fundcare.bank.model.Transaction> transactions = new java.util.ArrayList<>();
                for (com.fundcare.bank.model.Account acc : accounts) {
                        transactions
                                        .addAll(transactionRepository
                                                        .findBySenderAccountOrReceiverAccountOrderByTimestampDesc(acc,
                                                                        acc));
                }
                // Limit to 10 recent
                transactions = transactions.stream().limit(10).collect(java.util.stream.Collectors.toList());

                Map<String, Object> details = new HashMap<>();
                details.put("user", user);
                details.put("accounts", accounts);
                details.put("recentTransactions", transactions);
                details.put("cards", cardRepository.findByUser(user));
                details.put("investments", investmentRepository.findByUser(user));

                return details;
        }

        public List<com.fundcare.bank.model.ServiceRequest> getPendingServiceRequests() {
                return serviceRequestRepository.findAll().stream()
                                .filter(r -> "PENDING".equals(r.getStatus()))
                                .collect(java.util.stream.Collectors.toList());
        }

        public com.fundcare.bank.model.ServiceRequest approveRequest(Long requestId) {
                com.fundcare.bank.model.ServiceRequest request = serviceRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                if (!"PENDING".equals(request.getStatus())) {
                        throw new RuntimeException("Request is not pending");
                }

                request.setStatus("APPROVED");
                com.fundcare.bank.model.ServiceRequest savedRequest = serviceRequestRepository.save(request);

                // Handle specific request types
                if (request.getAdditionalDetails() != null && request.getAdditionalDetails().contains("Admin Access")) {
                        User user = request.getUser();
                        user.setRole(com.fundcare.bank.model.Role.ADMIN);
                        userRepository.save(user);
                        auditLogService.log("ADMIN_ACTION", "User " + user.getEmail() + " promoted to ADMIN", null);
                }

                notificationService.createNotification(request.getUser(), "Request Approved",
                                "Your request for " + request.getType() + " has been approved.", "SUCCESS");

                return savedRequest;
        }

        public com.fundcare.bank.model.ServiceRequest rejectRequest(Long requestId) {
                com.fundcare.bank.model.ServiceRequest request = serviceRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                if (!"PENDING".equals(request.getStatus())) {
                        throw new RuntimeException("Request is not pending");
                }

                request.setStatus("REJECTED");
                com.fundcare.bank.model.ServiceRequest savedRequest = serviceRequestRepository.save(request);

                notificationService.createNotification(request.getUser(), "Request Rejected",
                                "Your request for " + request.getType() + " has been rejected.", "ERROR");

                return savedRequest;
        }
}
