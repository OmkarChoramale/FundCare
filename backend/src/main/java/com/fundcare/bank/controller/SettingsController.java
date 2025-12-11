package com.fundcare.bank.controller;

import com.fundcare.bank.model.ServiceRequest;
import com.fundcare.bank.model.ServiceRequestType;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.ServiceRequestRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class SettingsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        Long userId = Long.valueOf(request.get("userId"));
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect current password"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(@RequestBody Map<String, String> request) {
        Long userId = Long.valueOf(request.get("userId"));
        String password = request.get("password");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect password"));
        }

        // Soft delete or deactivate
        user.setActive(false);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Account deactivated successfully"));
    }

    @PostMapping("/request-admin")
    public ResponseEntity<?> requestAdmin(@RequestBody Map<String, String> request) {
        Long userId = Long.valueOf(request.get("userId"));
        String reason = request.get("reason");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setUser(user);
        serviceRequest.setType(ServiceRequestType.OTHER); // Or add a specific type
        serviceRequest.setAdditionalDetails("Request for Admin Access: " + reason);
        serviceRequest.setStatus("PENDING");
        serviceRequest.setRequestDate(LocalDateTime.now());

        serviceRequestRepository.save(serviceRequest);

        return ResponseEntity.ok(Map.of("message", "Admin access request submitted"));
    }
}
