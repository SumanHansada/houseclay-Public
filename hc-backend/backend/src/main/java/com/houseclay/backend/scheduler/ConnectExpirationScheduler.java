package com.houseclay.backend.scheduler;

import com.houseclay.backend.entity.ConnectStatus;
import com.houseclay.backend.repository.ConnectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
public class ConnectExpirationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ConnectExpirationScheduler.class);

    @Autowired
    private ConnectRepository connectRepository;

    @Value("${app.connect.expiration-days:30}")
    private int expirationDays;

    @Scheduled(cron = "0 0 0 * * *") // Runs daily at midnight
    public void expireConnects() {
        logger.info("Running Connect Expiration Scheduler...");
        
        LocalDateTime cutoff = LocalDateTime.now().minus(expirationDays, ChronoUnit.DAYS);
        Timestamp expiryDate = Timestamp.valueOf(cutoff);

        int updatedCount = connectRepository.expireOldConnects(
                ConnectStatus.EXPIRED,
                ConnectStatus.ACTIVE,
                expiryDate
        );

        logger.info("Expired {} connects older than {}.", updatedCount, expiryDate);
    }
}