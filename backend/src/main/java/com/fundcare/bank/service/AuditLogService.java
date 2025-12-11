package com.fundcare.bank.service;

import com.fundcare.bank.model.AuditLog;
import com.fundcare.bank.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String eventType, String description, Long userId) {
        AuditLog log = new AuditLog();
        log.setEventType(eventType);
        log.setDescription(description);
        log.setUserId(userId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
