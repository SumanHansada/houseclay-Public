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
public class PropertyReverificationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PropertyReverificationScheduler.class);

    @Autowired
    private PropertyRepository propertyRepository;

    @Value("${app.property.reverification-expiration-days:30}")
    private int expirationDays;

    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    @Transactional
    public void schedulePropertyReverification() {
        logger.info("Starting PropertyReverificationScheduler to flag properties for reverification");

        Timestamp thresholdDate = Timestamp.valueOf(LocalDateTime.now().minusDays(expirationDays));
        List<PropertyUpdateType> updateTypes = Arrays.asList(PropertyUpdateType.VERIFIED, PropertyUpdateType.RE_VERIFIED);

        List<Property> propertiesToReverify = propertyRepository.findPropertiesForReverification(PropertyState.ACTIVE, updateTypes, thresholdDate);

        if (propertiesToReverify.isEmpty()) {
            logger.info("No properties found for reverification.");
            return;
        }

        logger.info("Found {} properties to reverify. Updating their state to PENDING_RE_VERIFICATION.", propertiesToReverify.size());

        for (Property property : propertiesToReverify) {
            property.setPropertyState(PropertyState.PENDING_RE_VERIFICATION);
            
            PropertyUpdateLog updateLog = new PropertyUpdateLog();
            updateLog.setProperty(property);
            updateLog.setUpdateType(PropertyUpdateType.UPDATE);
            updateLog.setComment("Automated state change to PENDING_RE_VERIFICATION by scheduler due to expiration");
            updateLog.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            
            property.getPropertyUpdateLogs().add(updateLog);
        }

        propertyRepository.saveAll(propertiesToReverify);
        logger.info("Successfully updated state for {} properties.", propertiesToReverify.size());
    }
}
