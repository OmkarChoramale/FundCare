package com.fundcare.bank.controller;

import com.fundcare.bank.service.StatementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statements")
@CrossOrigin(origins = "http://localhost:5173")
public class StatementController {

    @Autowired
    private StatementService statementService;

    @GetMapping("/download/{accountId}")
    public ResponseEntity<byte[]> downloadStatement(@PathVariable Long accountId) {
        try {
            byte[] pdfBytes = statementService.generateStatement(accountId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "statement_" + accountId + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
