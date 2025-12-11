package com.fundcare.bank.service;

import com.fundcare.bank.model.Card;
import com.fundcare.bank.model.CardType;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.CardRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    public Card issueCard(Long userId, CardType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Card card = new Card();
        card.setUser(user);
        card.setType(type);
        card.setCardHolderName(user.getFullName().toUpperCase());

        // Generate Mock Card Details
        card.setCardNumber(generateCardNumber());
        card.setExpiryDate(generateExpiryDate());
        card.setCvv(String.valueOf(new Random().nextInt(900) + 100));

        if (type == CardType.CREDIT) {
            card.setLimitAmount(new BigDecimal("100000")); // Default Credit Limit
            card.setUsedAmount(BigDecimal.ZERO);
        } else {
            card.setLimitAmount(new BigDecimal("50000")); // Daily Withdrawal Limit
        }

        card.setStatus("ACTIVE");
        card.setInternationalEnabled(false);

        return cardRepository.save(card);
    }

    public List<Card> getUserCards(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cardRepository.findByUser(user);
    }

    public Card toggleBlock(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if ("BLOCKED".equals(card.getStatus())) {
            card.setStatus("ACTIVE");
        } else {
            card.setStatus("BLOCKED");
        }
        return cardRepository.save(card);
    }

    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder("4"); // Visa starts with 4
        for (int i = 0; i < 15; i++) {
            sb.append(random.nextInt(10));
        }
        // Format: 4111 1111 1111 1111
        return sb.toString().replaceAll("(.{4})", "$1 ").trim();
    }

    private String generateExpiryDate() {
        LocalDate date = LocalDate.now().plusYears(5);
        return String.format("%02d/%d", date.getMonthValue(), date.getYear() % 100);
    }
}
