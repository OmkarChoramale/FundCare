package com.fundcare.bank.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "beneficiaries")
public class Beneficiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who added this beneficiary

    private String name;
    private String accountNumber;
    private String bankName;
    private String ifscCode;
    private String nickname;
}
