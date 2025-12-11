package com.fundcare.bank.service;

import com.fundcare.bank.model.Investment;
import com.fundcare.bank.model.InvestmentType;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.InvestmentRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Investment buyInvestment(Long userId, InvestmentType type, String name, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Investment investment = new Investment();
        investment.setUser(user);
        investment.setType(type);
        investment.setName(name);
        investment.setInvestedAmount(amount);
        investment.setPurchaseDate(LocalDate.now());

        // Mock logic for units and current value
        // Assume price is 100 per unit for simplicity
        BigDecimal pricePerUnit = new BigDecimal("100");
        investment.setUnits(amount.divide(pricePerUnit));

        // Mock current value (randomized slightly higher or lower)
        double randomFactor = 0.95 + (1.1 - 0.95) * new Random().nextDouble(); // -5% to +10%
        investment.setCurrentValue(amount.multiply(new BigDecimal(randomFactor)));

        Investment savedInvestment = investmentRepository.save(investment);

        // Notify User
        notificationService.createNotification(user, "Investment Successful",
                "You successfully invested $" + amount + " in " + name, "SUCCESS");

        return savedInvestment;
    }

    public List<Investment> getUserInvestments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return investmentRepository.findByUser(user);
    }
}
