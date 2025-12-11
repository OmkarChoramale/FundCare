package com.fundcare.bank.controller;

import com.fundcare.bank.model.Investment;
import com.fundcare.bank.model.InvestmentType;
import com.fundcare.bank.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "http://localhost:5173")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @PostMapping("/buy")
    public ResponseEntity<?> buyInvestment(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String typeStr = (String) payload.get("type");
            String name = (String) payload.get("name");
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());

            InvestmentType type = InvestmentType.valueOf(typeStr);
            Investment investment = investmentService.buyInvestment(userId, type, name, amount);

            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/buy-my-investment")
    public ResponseEntity<?> buyMyInvestment(@RequestBody Map<String, Object> payload,
            java.security.Principal principal) {
        try {
            String email = principal.getName();
            com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String typeStr = (String) payload.get("type");
            String name = (String) payload.get("name");
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());

            InvestmentType type = InvestmentType.valueOf(typeStr);
            Investment investment = investmentService.buyInvestment(user.getId(), type, name, amount);

            return ResponseEntity.ok(investment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserInvestments(@PathVariable Long userId) {
        List<Investment> investments = investmentService.getUserInvestments(userId);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/my-investments")
    public ResponseEntity<?> getMyInvestments(java.security.Principal principal) {
        String email = principal.getName();
        com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Investment> investments = investmentService.getUserInvestments(user.getId());
        return ResponseEntity.ok(investments);
    }
}
