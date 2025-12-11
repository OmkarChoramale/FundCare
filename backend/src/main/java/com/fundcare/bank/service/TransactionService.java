package com.fundcare.bank.service;

import com.fundcare.bank.model.*;
import com.fundcare.bank.repository.AccountRepository;
import com.fundcare.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

        @Autowired
        private AccountRepository accountRepository;

        @Autowired
        private TransactionRepository transactionRepository;

        @Autowired
        private AuditLogService auditLogService;

        @Autowired
        private NotificationService notificationService;

        @Transactional
        public Transaction transfer(Long senderAccountId, String receiverAccountNumber, BigDecimal amount,
                        String description, TransactionType type, PaymentMode mode) {
                Account sender = accountRepository.findById(senderAccountId)
                                .orElseThrow(() -> new RuntimeException("Sender account not found"));

                Account receiver = accountRepository.findByAccountNumber(receiverAccountNumber)
                                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

                if (sender.getBalance().compareTo(amount) < 0) {
                        throw new RuntimeException("Insufficient balance");
                }

                sender.setBalance(sender.getBalance().subtract(amount));
                receiver.setBalance(receiver.getBalance().add(amount));

                accountRepository.save(sender);
                accountRepository.save(receiver);

                Transaction transaction = new Transaction();
                transaction.setSenderAccount(sender);
                transaction.setReceiverAccount(receiver);
                transaction.setAmount(amount);
                transaction.setDescription(description);
                transaction.setTimestamp(LocalDateTime.now());
                transaction.setType(type);
                transaction.setPaymentMode(mode);
                transaction.setStatus("SUCCESS");

                Transaction savedTransaction = transactionRepository.save(transaction);

                auditLogService.log("TRANSFER",
                                "Transfer of $" + amount + " from Acc " + sender.getAccountNumber() + " to "
                                                + receiverAccountNumber,
                                sender.getUser().getId());

                // Notify Sender
                notificationService.createNotification(sender.getUser(), "Transfer Successful",
                                "You transferred $" + amount + " to " + receiverAccountNumber, "SUCCESS");

                // Notify Receiver
                notificationService.createNotification(receiver.getUser(), "Money Received",
                                "You received $" + amount + " from " + sender.getAccountNumber(), "INFO");

                return savedTransaction;
        }

        public List<Transaction> getHistory(Long accountId) {
                Account account = accountRepository.findById(accountId)
                                .orElseThrow(() -> new RuntimeException("Account not found"));
                return transactionRepository.findBySenderAccountOrReceiverAccountOrderByTimestampDesc(account, account);
        }
}
