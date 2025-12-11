package com.fundcare.bank.repository;

import com.fundcare.bank.model.BillPayment;
import com.fundcare.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillPaymentRepository extends JpaRepository<BillPayment, Long> {
    List<BillPayment> findByAccount(Account account);

    List<BillPayment> findByAccount_User_Id(Long userId);
}
