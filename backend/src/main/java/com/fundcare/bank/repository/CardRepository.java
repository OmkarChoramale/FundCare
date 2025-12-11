package com.fundcare.bank.repository;

import com.fundcare.bank.model.Card;
import com.fundcare.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByUser(User user);
}
