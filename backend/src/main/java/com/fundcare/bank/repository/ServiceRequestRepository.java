package com.fundcare.bank.repository;

import com.fundcare.bank.model.ServiceRequest;
import com.fundcare.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByAccount(Account account);

    List<ServiceRequest> findByAccount_User_Id(Long userId);
}
