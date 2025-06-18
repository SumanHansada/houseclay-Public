package com.houseclay.backend.service;

import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyMapper;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.UserRepository;
import com.houseclay.backend.utils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PropertyAdminService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyService propertyService;

    public Property addProperty(Property property, String phoneNo, Admin admin) throws APIException {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
            property.setOwner(user);
            property.setTitle(PropertyUtils.getTitle(property));
            property.getPropertUpdateLogs().add(new PropertyUpdateLog(property, admin, PropertyUpdateType.CREATE));
            user.getOwnedProperties().add(property);
            propertyService.indexPropertyInElastic(property);
            userRepository.save(user);
            return property;
        }
        throw new APIException("Invalid user", HttpStatus.BAD_REQUEST);
    }

    public Property updateProperty(Admin admin, Property property, String phoneNo) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(property.getPropertyID());
        if (propertyOpt.isEmpty()) {
            throw new APIException("Invalid property", HttpStatus.BAD_REQUEST);
        }
        if (!propertyOpt.get().getOwner().getPhoneNo().equals(phoneNo)) {
            throw new APIException("user not allowed", HttpStatus.FORBIDDEN);
        }
        property.getPropertUpdateLogs().add(new PropertyUpdateLog(property, admin, PropertyUpdateType.UPDATE));
        return propertyRepository.save(property);
    }

    public void deactivateProperty(Admin admin, String propertyID, String phoneNo) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyID);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Invalid property", HttpStatus.BAD_REQUEST);
        }
        if (!propertyOpt.get().getOwner().getPhoneNo().equals(phoneNo)) {
            throw new APIException("user not allowed", HttpStatus.FORBIDDEN);
        }
        Property property = propertyOpt.get();
        property.setPropertyState(PropertyState.INACTIVE);
        property.getPropertUpdateLogs().add(new PropertyUpdateLog(property, admin, PropertyUpdateType.DEACTIVATE));
        propertyRepository.save(property);
    }

    public Page<PropertyDTO> getPropertyByState(PropertyState propertyState, Pageable pageable) {
        return propertyRepository.findByPropertyState(propertyState, pageable)
                .map(PropertyMapper::toDTO);
    }

    public Property verifyProperty(String propertyId, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        property.getPropertUpdateLogs().add(new PropertyUpdateLog(property, admin, PropertyUpdateType.VERIFIED));
        property.setPropertyState(PropertyState.ACTIVE);
        return propertyRepository.save(property);
    }

    public Property reVerifyProperty(String propertyId, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        property.getPropertUpdateLogs().add(new PropertyUpdateLog(property, admin, PropertyUpdateType.RE_VERIFIED));
        property.setPropertyState(PropertyState.ACTIVE);
        return propertyRepository.save(property);
    }
}
