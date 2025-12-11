package com.fundcare.bank.controller;

import com.fundcare.bank.model.PaymentMode;
import com.fundcare.bank.model.Transaction;
import com.fundcare.bank.model.TransactionType;
import com.fundcare.bank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @Autowired
    private com.fundcare.bank.repository.AccountRepository accountRepository;

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> request) {
        try {
            Long senderAccountId = Long.valueOf(request.get("senderAccountId").toString());
            String receiverAccountNumber = (String) request.get("receiverAccountNumber");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String description = (String) request.get("description");

            // Default to THIRD_PARTY and IMPS if not provided (backward compatibility)
            String typeStr = (String) request.getOrDefault("type", "THIRD_PARTY_TRANSFER");
            String modeStr = (String) request.getOrDefault("mode", "IMPS");

            TransactionType type = TransactionType.valueOf(typeStr);
            PaymentMode mode = PaymentMode.valueOf(modeStr);

            Transaction transaction = transactionService.transfer(senderAccountId, receiverAccountNumber, amount,
                    description, type, mode);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/history/{accountId}")
    public ResponseEntity<?> getHistory(@PathVariable Long accountId) {
        List<Transaction> history = transactionService.getHistory(accountId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMyHistory(java.security.Principal principal) {
        String email = principal.getName();
        com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<com.fundcare.bank.model.Account> accounts = accountRepository.findByUser(user);
        java.util.List<Transaction> allTransactions = new java.util.ArrayList<>();

        for (com.fundcare.bank.model.Account account : accounts) {
            allTransactions.addAll(transactionService.getHistory(account.getId()));
        }

        // Sort by timestamp desc
        allTransactions.sort((t1, t2) -> t2.getTimestamp().compareTo(t1.getTimestamp()));

        return ResponseEntity.ok(allTransactions);
    }
}
