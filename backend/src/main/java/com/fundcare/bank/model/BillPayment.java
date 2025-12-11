package com.fundcare.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bill_payments")
public class BillPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    private String billerName;
    private String billerCategory; // ELECTRICITY, MOBILE, CREDIT_CARD
    private String consumerNumber;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paymentDate;
}
