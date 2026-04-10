package com.houseclay.backend.scheduler;

import com.houseclay.backend.repository.AdminLoginRepository;
import com.houseclay.backend.repository.UserLoginRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Component
public class TokenCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupScheduler.class);

    @Autowired
    private UserLoginRepository userLoginRepository;

    @Autowired
    private AdminLoginRepository adminLoginRepository;

    @Scheduled(cron = "0 0 2 * * *") // Runs daily at 2 AM
    public void purgeExpiredTokens() {
        logger.info("Running Token Cleanup Scheduler...");
        Timestamp now = new Timestamp(System.currentTimeMillis());

        int userTokensDeleted = userLoginRepository.deleteExpiredTokens(now);
        int adminTokensDeleted = adminLoginRepository.deleteExpiredTokens(now);

        logger.info("Purged {} expired user tokens and {} expired admin tokens.",
                userTokensDeleted, adminTokensDeleted);
    }
}
