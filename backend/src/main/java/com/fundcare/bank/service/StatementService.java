package com.fundcare.bank.service;

import com.fundcare.bank.model.Account;
import com.fundcare.bank.model.Transaction;
import com.fundcare.bank.repository.AccountRepository;
import com.fundcare.bank.repository.TransactionRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Service
public class StatementService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    public byte[] generateStatement(Long accountId) throws DocumentException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Transaction> transactions = transactionRepository
                .findBySenderAccountOrReceiverAccountOrderByTimestampDesc(account, account);

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        // Header
        Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Paragraph header = new Paragraph("FundCare Bank - Account Statement", fontHeader);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(Chunk.NEWLINE);

        // Account Details
        Font fontDetails = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.DARK_GRAY);
        document.add(new Paragraph("Account Number: " + account.getAccountNumber(), fontDetails));
        document.add(new Paragraph("Account Type: " + account.getType(), fontDetails));
        document.add(new Paragraph("Account Holder: " + account.getUser().getFullName(), fontDetails));
        document.add(new Paragraph("Generated Date: " + LocalDateTime.now().toString(), fontDetails));
        document.add(Chunk.NEWLINE);

        // Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        addTableHeader(table);
        addRows(table, transactions, account);

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table) {
        Stream.of("Date", "Description", "Type", "Amount")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setBorderWidth(1);
                    header.setPhrase(new Phrase(columnTitle));
                    table.addCell(header);
                });
    }

    private void addRows(PdfPTable table, List<Transaction> transactions, Account currentAccount) {
        for (Transaction transaction : transactions) {
            table.addCell(transaction.getTimestamp().toLocalDate().toString());
            table.addCell(transaction.getDescription());

            boolean isCredit = transaction.getReceiverAccount() != null
                    && transaction.getReceiverAccount().getId().equals(currentAccount.getId());
            String type = isCredit ? "CREDIT" : "DEBIT";
            table.addCell(type);

            String amount = (isCredit ? "+" : "-") + "$" + transaction.getAmount().toString();
            table.addCell(amount);
        }
    }
}
