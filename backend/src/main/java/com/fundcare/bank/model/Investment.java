package com.fundcare.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "investments")
public class Investment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private InvestmentType type;

    private String name; // e.g., "S&P 500 Index Fund"
    private BigDecimal investedAmount;
    private BigDecimal currentValue;
    private BigDecimal units; // For Mutual Funds/Stocks
    private LocalDate purchaseDate;
}
