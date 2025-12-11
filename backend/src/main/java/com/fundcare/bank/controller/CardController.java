package com.fundcare.bank.controller;

import com.fundcare.bank.model.Card;
import com.fundcare.bank.model.CardType;
import com.fundcare.bank.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:5173")
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private com.fundcare.bank.repository.UserRepository userRepository;

    @PostMapping("/issue")
    public ResponseEntity<?> issueCard(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String typeStr = (String) payload.get("type");
            CardType type = CardType.valueOf(typeStr);

            Card card = cardService.issueCard(userId, type);
            return ResponseEntity.ok(card);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/issue-my-card")
    public ResponseEntity<?> issueMyCard(@RequestBody Map<String, Object> payload, java.security.Principal principal) {
        try {
            String email = principal.getName();
            com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String typeStr = (String) payload.get("type");
            CardType type = CardType.valueOf(typeStr);

            Card card = cardService.issueCard(user.getId(), type);
            return ResponseEntity.ok(card);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCards(@PathVariable Long userId) {
        List<Card> cards = cardService.getUserCards(userId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/my-cards")
    public ResponseEntity<?> getMyCards(java.security.Principal principal) {
        String email = principal.getName();
        com.fundcare.bank.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Card> cards = cardService.getUserCards(user.getId());
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/{cardId}/toggle-block")
    public ResponseEntity<?> toggleBlock(@PathVariable Long cardId) {
        Card card = cardService.toggleBlock(cardId);
        return ResponseEntity.ok(card);
    }
}
