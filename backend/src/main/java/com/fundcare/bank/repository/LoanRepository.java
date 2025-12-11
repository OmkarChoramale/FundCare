package com.fundcare.bank.repository;

import com.fundcare.bank.model.Loan;
import com.fundcare.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser(User user);
}
