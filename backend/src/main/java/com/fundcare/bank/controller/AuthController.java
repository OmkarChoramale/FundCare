package com.fundcare.bank.controller;

import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.fundcare.bank.service.AccountService accountService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        // In real app, encode password here
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Create default Savings account
        accountService.createAccount(savedUser.getId(), com.fundcare.bank.model.AccountType.SAVINGS,
                java.math.BigDecimal.valueOf(1000.00));

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest,
            jakarta.servlet.http.HttpServletRequest request) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        logger.info("Login attempt for: {}", email);

        return userRepository.findByEmail(email)
                .map(user -> {
                    logger.info("User found: {}", user.getEmail());
                    boolean matches = passwordEncoder.matches(password, user.getPassword());
                    logger.info("Password matches: {}", matches);

                    if (matches) {
                        // Create Principal
                        org.springframework.security.core.userdetails.User principal = new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                java.util.Collections.singletonList(
                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                "ROLE_" + user.getRole().name())));

                        // Create Auth Token
                        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                principal, null, principal.getAuthorities());

                        // Set Context
                        org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder
                                .createEmptyContext();
                        context.setAuthentication(authentication);
                        org.springframework.security.core.context.SecurityContextHolder.setContext(context);

                        // Save Context to Session
                        jakarta.servlet.http.HttpSession session = request.getSession(true);
                        session.setAttribute("SPRING_SECURITY_CONTEXT", context);

                        logger.info("Session created: {}", session.getId());

                        return ResponseEntity.ok(Map.of("message", "Login successful", "user", user));
                    } else {
                        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
                    }
                })
                .orElseGet(() -> {
                    logger.info("User not found");
                    return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
                });
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        return userRepository.findByEmail(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }
}
