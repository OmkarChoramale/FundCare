package com.fundcare.bank.controller;

import com.fundcare.bank.model.AccountType;
import com.fundcare.bank.model.Deposit;
import com.fundcare.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin(origins = "http://localhost:5173")
public class DepositController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createDeposit(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String typeStr = (String) request.get("type");
            Double amountVal = Double.valueOf(request.get("amount").toString());
            Integer duration = Integer.valueOf(request.get("durationMonths").toString());

            AccountType type = AccountType.valueOf(typeStr.toUpperCase());
            Deposit deposit = accountService.createDeposit(userId, type, BigDecimal.valueOf(amountVal), duration);

            return ResponseEntity.ok(deposit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/create-my-deposit")
    public ResponseEntity<?> createMyDeposit(@RequestBody Map<String, Object> request,
            java.security.Principal principal) {
        try {
            String email = principal.getName();
            com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String typeStr = (String) request.get("type");
            Double amountVal = Double.valueOf(request.get("amount").toString());
            Integer duration = Integer.valueOf(request.get("durationMonths").toString());

            AccountType type = AccountType.valueOf(typeStr.toUpperCase());
            Deposit deposit = accountService.createDeposit(user.getId(), type, BigDecimal.valueOf(amountVal), duration);

            return ResponseEntity.ok(deposit);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserDeposits(@PathVariable Long userId) {
        List<Deposit> deposits = accountService.getUserDeposits(userId);
        return ResponseEntity.ok(deposits);
    }
}
