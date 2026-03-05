package com.houseclay.backend.scheduler;

import com.houseclay.backend.service.ConnectManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ConnectExpirationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ConnectExpirationScheduler.class);

    @Autowired
    private ConnectManagementService connectManagementService;

    @Value("${app.connect.expiration-days:30}")
    private int expirationDays;

    @Scheduled(cron = "0 0 0 * * *") // Runs daily at midnight
    public void expireConnects() {
        logger.info("Running Connect Expiration Scheduler...");
        
        int updatedCount = connectManagementService.expireOldConnects(expirationDays);

        logger.info("Expired {} connects in bulk.", updatedCount);
    }
}