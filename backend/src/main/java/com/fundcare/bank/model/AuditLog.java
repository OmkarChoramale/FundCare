package com.fundcare.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventType; // LOGIN, TRANSFER, ADMIN_ACTION, ERROR
    private String description;
    private Long userId; // Nullable if system event or failed login
    private String ipAddress; // Optional
    private LocalDateTime timestamp;
}
