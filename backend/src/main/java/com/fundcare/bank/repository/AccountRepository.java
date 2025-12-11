package com.fundcare.bank.repository;

import com.fundcare.bank.model.Account;
import com.fundcare.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);

    List<Account> findByUserId(Long userId);

    Optional<Account> findByAccountNumber(String accountNumber);
}
