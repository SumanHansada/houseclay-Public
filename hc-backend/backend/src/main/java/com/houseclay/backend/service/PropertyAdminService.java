package com.houseclay.backend.service;

import com.houseclay.backend.dto.UserPropertyDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.UserMapper;
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
    private PropertyElasticService propertyElasticService;

    public Property addProperty(Property property, String phoneNo, Admin admin) throws APIException {
        Optional<User> userOpt = userRepository.findById(phoneNo);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            property.setPropertyState(PropertyState.PENDING_VERIFICATION);
            property.setOwner(user);
            property.setTitle(PropertyUtils.getTitle(property));
            property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, admin, "added by admin", PropertyUpdateType.CREATE));
            user.getOwnedProperties().add(property);
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
        property.setPropertyState(PropertyState.PENDING_VERIFICATION);
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, admin, "updated by admin", PropertyUpdateType.UPDATE));
        return propertyRepository.save(property);
    }

    public void deactivateProperty(Admin admin, String propertyID, String comment) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyID);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Invalid property", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        property.setPropertyState(PropertyState.INACTIVE);
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, admin, comment, PropertyUpdateType.DEACTIVATE));
        propertyRepository.save(property);
        propertyElasticService.deletePropertyInElastic(property);
    }

    public Page<UserPropertyDTO> getProperties(Pageable pageable) {
        return propertyRepository.findAll(pageable)
                .map(UserMapper::toUserPropertyDTO);
    }

    public Page<UserPropertyDTO> getPropertyByState(PropertyState propertyState, Pageable pageable) {
        return propertyRepository.findByPropertyState(propertyState, pageable)
                .map(UserMapper::toUserPropertyDTO);
    }

    public Property verifyProperty(String propertyId, String comment, Long score, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        property.setScore(score);
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, admin, comment, PropertyUpdateType.VERIFIED));
        property.setPropertyState(PropertyState.ACTIVE);
        property = propertyRepository.save(property);
        propertyElasticService.indexPropertyInElastic(property);
        return property;
    }

    public Property reVerifyProperty(String propertyId, String comment, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, admin, comment, PropertyUpdateType.RE_VERIFIED));
        property.setPropertyState(PropertyState.ACTIVE);
        property = propertyRepository.save(property);
        propertyElasticService.indexPropertyInElastic(property);
        return property;
    }

    public Property updateExclusiveTag(String propertyID, boolean tag, Admin admin) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyID);
        if (propertyOpt.isEmpty()) {
            throw new APIException("Property not found", HttpStatus.BAD_REQUEST);
        }

        Property property = propertyOpt.get();
        property.setPremium(tag);
        property.getPropertyUpdateLogs().add(new PropertyUpdateLog(property, admin, "exclusive tag updated", PropertyUpdateType.UPDATE));
        return propertyRepository.save(property);
    }
}
