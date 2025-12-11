package com.fundcare.bank.service;

import com.fundcare.bank.model.Loan;
import com.fundcare.bank.model.LoanType;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.LoanRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    public Loan applyForLoan(Long userId, LoanType type, BigDecimal amount, Integer tenureMonths) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setType(type);
        loan.setAmount(amount);
        loan.setTenureMonths(tenureMonths);
        loan.setStatus("PENDING");
        loan.setApplicationDate(LocalDate.now());

        // Set interest rate based on type (Mock logic)
        switch (type) {
            case PERSONAL_LOAN:
                loan.setInterestRate(new BigDecimal("12.5"));
                break;
            case HOME_LOAN:
                loan.setInterestRate(new BigDecimal("8.5"));
                break;
            case CAR_LOAN:
                loan.setInterestRate(new BigDecimal("9.0"));
                break;
            case EDUCATION_LOAN:
                loan.setInterestRate(new BigDecimal("10.0"));
                break;
            case GOLD_LOAN:
                loan.setInterestRate(new BigDecimal("7.5"));
                break;
        }

        // Calculate Estimated EMI (P * R * (1+R)^N / ((1+R)^N - 1))
        // Simplified for now: (Principal + Interest) / Months
        BigDecimal interest = amount.multiply(loan.getInterestRate()).divide(new BigDecimal(100));
        BigDecimal totalAmount = amount.add(interest);
        BigDecimal emi = totalAmount.divide(new BigDecimal(tenureMonths), 2, RoundingMode.HALF_UP);
        loan.setEmiAmount(emi);

        return loanRepository.save(loan);
    }

    public List<Loan> getUserLoans(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return loanRepository.findByUser(user);
    }
}
