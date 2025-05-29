package com.houseclay.backend.service;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.entity.ActionType;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyAction;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.repository.PropertyActionRepository;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShortlistPropertyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyActionRepository propertyActionRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public Property shortlistProperty(User user, String propertyId) throws Exception {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }
        Property property = propertyOpt.get();
        PropertyAction propertyAction = new PropertyAction();
        propertyAction.setProperty(property);
        propertyAction.setUser(user);
        propertyAction.setCreatedAt(LocalDateTime.now());
        propertyAction.setActionType(ActionType.SHORTLIST);
        user.getPropertyActions().add(propertyAction);
        userRepository.save(user);
        return property;
    }

    public void removeShortlistedProperty(User user, String propertyId) throws Exception {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }
        propertyActionRepository.deleteByUserAndPropertyAndActionType(user, propertyOpt.get(), ActionType.SHORTLIST);
    }

    public List<PropertyDTO> getShortlistedProperties(User user) {
        List<PropertyAction> actions = propertyActionRepository.findByUserAndActionType(user, ActionType.SHORTLIST);

        return actions.stream()
                .map(PropertyAction::getProperty)
                .map(PropertyMapper::toDTO)
                .toList();
    }
}
