package com.houseclay.backend.service;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.entity.UserActionType;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyAction;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.mapper.PropertySearchMapper;
import com.houseclay.backend.repository.PropertyActionRepository;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class ViewPropertyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyActionRepository propertyActionRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public ResponseEntity<?> getProperty(User user, String propertyId) throws Exception {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }
        Property property = propertyOpt.get();
        boolean viewed = property.getPropertyActions().stream().anyMatch(
                action -> action.getUserActionType().equals(UserActionType.VIEW) &&
                        action.getUser() != null &&
                        action.getUser().getPhoneNo().equalsIgnoreCase(user.getPhoneNo())
        );
        boolean contacted = property.getPropertyActions().stream().anyMatch(
                action -> action.getUserActionType() == UserActionType.CONTACT &&
                        action.getUser() != null &&
                        action.getUser().getPhoneNo().equalsIgnoreCase(user.getPhoneNo())
        );

        boolean reported = property.getReportedProperties().stream().anyMatch(
                reportProperty -> reportProperty.getUser().getPhoneNo().equalsIgnoreCase(user.getPhoneNo())
        );

        if (!viewed) {
            property.setScore(property.getScore() + 1);
            PropertyAction propertyAction = new PropertyAction();
            propertyAction.setProperty(property);
            propertyAction.setUser(user);
            propertyAction.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            propertyAction.setUserActionType(UserActionType.VIEW);
            property.getPropertyActions().add(propertyAction);
            propertyRepository.save(property);
        }
        if (contacted || property.getOwner().getPhoneNo().equalsIgnoreCase(user.getPhoneNo())) {
            return ResponseEntity.ok(PropertySearchMapper.toPropertyUserSearchDTO(property, property.getOwner(), reported));
        }
        return ResponseEntity.ok(PropertySearchMapper.toPropertyUserSearchDTO(property, null, reported));
    }

    public List<PropertyDTO> getViewedProperties(User user) {
        List<PropertyAction> actions = propertyActionRepository.findByUserAndUserActionType(user, UserActionType.VIEW);

        return actions.stream()
                .map(PropertyAction::getProperty)
                .map(PropertyMapper::toBasicDTO)
                .toList();
    }
}
