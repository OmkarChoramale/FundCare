package com.fundcare.bank.controller;

import com.fundcare.bank.model.BillPayment;
import com.fundcare.bank.service.BillPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillPaymentController {

    @Autowired
    private BillPaymentService billPaymentService;

    @PostMapping("/pay")
    public ResponseEntity<?> payBill(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.valueOf(payload.get("accountId").toString());
            String billerName = (String) payload.get("billerName");
            String category = (String) payload.get("category");
            String consumerNumber = (String) payload.get("consumerNumber");
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());

            BillPayment payment = billPaymentService.payBill(accountId, billerName, category, consumerNumber, amount);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getHistory(@PathVariable Long userId) {
        List<BillPayment> history = billPaymentService.getUserHistory(userId);
        return ResponseEntity.ok(history);
    }
}
