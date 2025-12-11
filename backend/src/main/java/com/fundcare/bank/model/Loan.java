package com.fundcare.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private LoanType type;

    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer tenureMonths;

    private String status; // PENDING, APPROVED, REJECTED, ACTIVE, CLOSED
    private LocalDate applicationDate;
    private LocalDate startDate;
    private BigDecimal emiAmount;
}
