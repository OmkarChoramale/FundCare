package com.fundcare.bank.service;

import com.fundcare.bank.model.Account;
import com.fundcare.bank.model.AccountType;
import com.fundcare.bank.model.User;
import com.fundcare.bank.repository.AccountRepository;
import com.fundcare.bank.repository.DepositRepository;
import com.fundcare.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private UserRepository userRepository;

    public Account createAccount(Long userId, AccountType type, BigDecimal initialDeposit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setUser(user);
        account.setType(type);
        account.setBalance(initialDeposit);

        return accountRepository.save(account);
    }

    public List<Account> getUserAccounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUser(user);
    }

    @Transactional
    public com.fundcare.bank.model.Deposit createDeposit(Long userId, AccountType type, BigDecimal amount,
            Integer durationMonths) {
        // 1. Validate User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Create the Account for this Deposit
        Account account = new Account();
        account.setUser(user);
        account.setType(type);
        account.setBalance(amount); // For FD, balance is the principal initially
        account = accountRepository.save(account);

        // 3. Calculate Maturity (Simple logic for demo)
        // Interest Rate: 6.5% for FD, 7.0% for RD
        double rate = type == AccountType.FIXED_DEPOSIT ? 6.5 : 7.0;
        BigDecimal interest = amount.multiply(BigDecimal.valueOf(rate / 100))
                .multiply(BigDecimal.valueOf(durationMonths / 12.0));
        BigDecimal maturityAmount = amount.add(interest);

        // 4. Create Deposit Record
        com.fundcare.bank.model.Deposit deposit = new com.fundcare.bank.model.Deposit();
        deposit.setAccount(account);
        deposit.setPrincipalAmount(amount);
        deposit.setInterestRate(rate);
        deposit.setDurationMonths(durationMonths);
        deposit.setStartDate(LocalDate.now());
        deposit.setMaturityDate(LocalDate.now().plusMonths(durationMonths));
        deposit.setMaturityAmount(maturityAmount);
        deposit.setType(type);

        return depositRepository.save(deposit);
    }

    public List<com.fundcare.bank.model.Deposit> getUserDeposits(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return depositRepository.findByUser(user);
    }

    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }
}
