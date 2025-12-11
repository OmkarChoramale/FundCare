package com.fundcare.bank.controller;

import com.fundcare.bank.model.Account;
import com.fundcare.bank.model.AccountType;
import com.fundcare.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String typeStr = (String) request.get("type");
            Double initialDeposit = Double.valueOf(request.get("initialDeposit").toString());

            AccountType type = AccountType.valueOf(typeStr.toUpperCase());
            Account account = accountService.createAccount(userId, type, BigDecimal.valueOf(initialDeposit));

            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAccounts(@PathVariable Long userId) {
        List<Account> accounts = accountService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/my-accounts")
    public ResponseEntity<?> getMyAccounts(java.security.Principal principal) {
        String email = principal.getName();
        com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Account> accounts = accountService.getUserAccounts(user.getId());
        return ResponseEntity.ok(accounts);
    }
}
