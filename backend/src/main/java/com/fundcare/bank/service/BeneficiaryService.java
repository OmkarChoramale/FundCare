package com.fundcare.bank.service;

import com.fundcare.bank.model.Beneficiary;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.BeneficiaryRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryService {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private UserRepository userRepository;

    public Beneficiary addBeneficiary(Long userId, String name, String accountNumber, String bankName, String ifscCode,
            String nickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setUser(user);
        beneficiary.setName(name);
        beneficiary.setAccountNumber(accountNumber);
        beneficiary.setBankName(bankName);
        beneficiary.setIfscCode(ifscCode);
        beneficiary.setNickname(nickname);

        return beneficiaryRepository.save(beneficiary);
    }

    public List<Beneficiary> getUserBeneficiaries(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return beneficiaryRepository.findByUser(user);
    }

    public void deleteBeneficiary(Long id) {
        beneficiaryRepository.deleteById(id);
    }
}
