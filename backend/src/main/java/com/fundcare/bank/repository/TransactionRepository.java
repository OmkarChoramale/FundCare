package com.fundcare.bank.repository;

import com.fundcare.bank.model.Transaction;
import com.fundcare.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderAccountOrReceiverAccountOrderByTimestampDesc(Account senderAccount,
            Account receiverAccount);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = :type AND MONTH(t.timestamp) = MONTH(CURRENT_DATE) AND YEAR(t.timestamp) = YEAR(CURRENT_DATE)")
    java.math.BigDecimal sumAmountByTypeAndCurrentMonth(
            @org.springframework.data.repository.query.Param("type") com.fundcare.bank.model.TransactionType type);
}
