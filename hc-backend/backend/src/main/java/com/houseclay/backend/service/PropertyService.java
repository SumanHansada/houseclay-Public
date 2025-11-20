package com.houseclay.backend.service;

import com.houseclay.backend.dto.PropertyCardDTO;
import com.houseclay.backend.dto.UserPropertyDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.PropertyCardMapper;
import com.houseclay.backend.mapper.UserMapper;
import com.houseclay.backend.repository.NeighbourhoodRepository;
import com.houseclay.backend.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private NeighbourhoodRepository neighbourhoodRepository;

    final static long POPULAR_NEIGHBOURHOOD_THRESHOLD = 10;

    @Autowired
    private PhotoService photoService;

    public Property getProperty(String id) throws APIException {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        if (propertyOpt.isPresent()) {
            return propertyOpt.get();
        }
        throw new APIException("Invalid property ID", HttpStatus.BAD_REQUEST);
    }

    public List<PropertyCardDTO> getStandout() {
        List<Property> propertyList = propertyRepository.findTop10ByPropertyStateOrderByScoreDesc(PropertyState.ACTIVE);
        return propertyList.stream().map(PropertyCardMapper::toPropertyCardDTO).collect(Collectors.toList());
    }

    public List<Neighbourhood> getPopularNeighbourhood() {
        return neighbourhoodRepository.findByPropertyCountGreaterThan(POPULAR_NEIGHBOURHOOD_THRESHOLD);
    }
}
