package com.fundcare.bank.controller;

import com.fundcare.bank.model.Loan;
import com.fundcare.bank.model.LoanType;
import com.fundcare.bank.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:5173")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String typeStr = (String) payload.get("type");
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            Integer tenure = Integer.valueOf(payload.get("tenure").toString());

            LoanType type = LoanType.valueOf(typeStr);
            Loan loan = loanService.applyForLoan(userId, type, amount, tenure);

            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/apply-my-loan")
    public ResponseEntity<?> applyMyLoan(@RequestBody Map<String, Object> payload, java.security.Principal principal) {
        try {
            String email = principal.getName();
            com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String typeStr = (String) payload.get("type");
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            Integer tenure = Integer.valueOf(payload.get("tenure").toString());

            LoanType type = LoanType.valueOf(typeStr);
            Loan loan = loanService.applyForLoan(user.getId(), type, amount, tenure);

            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserLoans(@PathVariable Long userId) {
        List<Loan> loans = loanService.getUserLoans(userId);
        return ResponseEntity.ok(loans);
    }
}
