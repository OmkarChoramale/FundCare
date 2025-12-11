package com.fundcare.bank.service;

import com.fundcare.bank.model.Account;
import com.fundcare.bank.model.ServiceRequest;
import com.fundcare.bank.model.ServiceRequestType;
import com.fundcare.bank.repository.AccountRepository;
import com.fundcare.bank.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private AccountRepository accountRepository;

    public ServiceRequest createRequest(Long accountId, ServiceRequestType type, String details) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServiceRequest request = new ServiceRequest();
        request.setAccount(account);
        request.setType(type);
        request.setStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());
        request.setAdditionalDetails(details);

        return serviceRequestRepository.save(request);
    }

    public List<ServiceRequest> getUserRequests(Long userId) {
        return serviceRequestRepository.findByAccount_User_Id(userId);
    }
}
