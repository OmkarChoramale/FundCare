package com.fundcare.bank.service;

import com.fundcare.bank.model.*;
import com.fundcare.bank.repository.AccountRepository;
import com.fundcare.bank.repository.BillPaymentRepository;
import com.fundcare.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillPaymentService {

    @Autowired
    private BillPaymentRepository billPaymentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public BillPayment payBill(Long accountId, String billerName, String category, String consumerNumber,
            BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct balance
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        // Record Bill Payment
        BillPayment payment = new BillPayment();
        payment.setAccount(account);
        payment.setBillerName(billerName);
        payment.setBillerCategory(category);
        payment.setConsumerNumber(consumerNumber);
        payment.setAmount(amount);
        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());
        billPaymentRepository.save(payment);

        // Record Transaction
        Transaction transaction = new Transaction();
        transaction.setSenderAccount(account);
        transaction.setAmount(amount);
        transaction.setDescription("Bill Pay: " + billerName);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setType(TransactionType.BILL_PAYMENT);
        transaction.setPaymentMode(PaymentMode.INTERNAL);
        transaction.setStatus("SUCCESS");
        transactionRepository.save(transaction);

        return payment;
    }

    public List<BillPayment> getUserHistory(Long userId) {
        return billPaymentRepository.findByAccount_User_Id(userId);
    }
}
