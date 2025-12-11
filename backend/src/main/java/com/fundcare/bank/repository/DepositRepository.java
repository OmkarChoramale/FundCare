package com.fundcare.bank.repository;

import com.fundcare.bank.model.Deposit;
import com.fundcare.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DepositRepository extends JpaRepository<Deposit, Long> {
    @Query("SELECT d FROM Deposit d WHERE d.account.user = :user")
    List<Deposit> findByUser(@Param("user") User user);
}
