package com.fundcare.bank.repository;

import com.fundcare.bank.model.Investment;
import com.fundcare.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUser(User user);
}
