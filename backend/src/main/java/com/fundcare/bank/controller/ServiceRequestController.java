package com.fundcare.bank.controller;

import com.fundcare.bank.model.ServiceRequest;
import com.fundcare.bank.model.ServiceRequestType;
import com.fundcare.bank.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.valueOf(payload.get("accountId").toString());
            String typeStr = (String) payload.get("type");
            String details = (String) payload.get("details");

            ServiceRequestType type = ServiceRequestType.valueOf(typeStr);
            ServiceRequest request = serviceRequestService.createRequest(accountId, type, details);

            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRequests(@PathVariable Long userId) {
        List<ServiceRequest> requests = serviceRequestService.getUserRequests(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests(java.security.Principal principal) {
        String email = principal.getName();
        com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<ServiceRequest> requests = serviceRequestService.getUserRequests(user.getId());
        return ResponseEntity.ok(requests);
    }
}
