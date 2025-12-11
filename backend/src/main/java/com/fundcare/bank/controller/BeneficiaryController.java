package com.fundcare.bank.controller;

import com.fundcare.bank.model.Beneficiary;
import com.fundcare.bank.service.BeneficiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/beneficiaries")
@CrossOrigin(origins = "http://localhost:5173")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryService beneficiaryService;

    @PostMapping("/add")
    public ResponseEntity<?> addBeneficiary(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String name = (String) payload.get("name");
            String accountNumber = (String) payload.get("accountNumber");
            String bankName = (String) payload.get("bankName");
            String ifscCode = (String) payload.get("ifscCode");
            String nickname = (String) payload.get("nickname");

            Beneficiary beneficiary = beneficiaryService.addBeneficiary(userId, name, accountNumber, bankName, ifscCode,
                    nickname);
            return ResponseEntity.ok(beneficiary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBeneficiaries(@PathVariable Long userId) {
        List<Beneficiary> beneficiaries = beneficiaryService.getUserBeneficiaries(userId);
        return ResponseEntity.ok(beneficiaries);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBeneficiary(@PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(id);
        return ResponseEntity.ok().build();
    }
}
