package com.houseclay.backend.scheduler;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyState;
import com.houseclay.backend.entity.PropertyUpdateLog;
import com.houseclay.backend.entity.PropertyUpdateType;
import com.houseclay.backend.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;



@Component
@EnableScheduling
public class PropertyRoutineCheckScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PropertyRoutineCheckScheduler.class);

    @Autowired
    private PropertyRepository propertyRepository;

    @Value("${app.property.routine-check-expiration-days:30}")
    private int expirationDays;

    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    @Transactional
    public void schedulePropertyRoutineCheck() {
        logger.info("Starting PropertyRoutineCheckScheduler to flag properties for routine monthly checks");

        Timestamp thresholdDate = Timestamp.valueOf(LocalDateTime.now().minusDays(expirationDays));
        List<PropertyUpdateType> updateTypes = Arrays.asList(PropertyUpdateType.VERIFIED, PropertyUpdateType.RE_VERIFIED, PropertyUpdateType.ROUTINE_CHECK);

        List<Property> propertiesToCheck = propertyRepository.findPropertiesForRoutineCheck(PropertyState.ACTIVE, updateTypes, thresholdDate);

        if (propertiesToCheck.isEmpty()) {
            logger.info("No properties found for routine check.");
            return;
        }

        logger.info("Found {} properties for routine check. Updating their state to PENDING_ROUTINE_CHECK.", propertiesToCheck.size());

        for (Property property : propertiesToCheck) {
            property.setPropertyState(PropertyState.PENDING_ROUTINE_CHECK);
            property.getPropertyUpdateLogs().add(PropertyUpdateLog.forSystem(
                    property,
                    "Automated state change to PENDING_ROUTINE_CHECK by scheduler due to expiration",
                    PropertyUpdateType.ROUTINE_CHECK
            ));
        }

        propertyRepository.saveAll(propertiesToCheck);
        logger.info("Successfully updated state for {} properties.", propertiesToCheck.size());
    }
}
