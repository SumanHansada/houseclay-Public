package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PhotoService photoService;

    public Property getProperty(String id) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        if (propertyOpt.isPresent()) {
            Property property = propertyOpt.get();
            property.setImages(
                    property.getImages().stream()
                            .map(photoService::getObjectPresignedUrl)
                            .collect(Collectors.toList())
            );
            return propertyOpt.get();
        }
        throw new APIException("Invalid property ID", HttpStatus.BAD_REQUEST);
    }
}
