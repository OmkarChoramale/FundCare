package com.fundcare.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private CardType type;

    private String cardNumber; // Masked or Encrypted in real app
    private String cardHolderName;
    private String expiryDate; // MM/YY
    private String cvv;

    private BigDecimal limitAmount; // For Credit Card or Daily Limit for Debit
    private BigDecimal usedAmount; // For Credit Card

    private String status; // ACTIVE, BLOCKED, EXPIRED
    private boolean isInternationalEnabled;
}
