package com.houseclay.backend.service;

import com.houseclay.backend.entity.FlatmateProperty;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.RentProperty;
import com.houseclay.backend.entity.SaleProperty;
import com.houseclay.backend.entity.elastic.FlatmateDocument;
import com.houseclay.backend.entity.elastic.PropertyDocument;
import com.houseclay.backend.entity.elastic.RentDocument;
import com.houseclay.backend.entity.elastic.SaleDocument;
import com.houseclay.backend.repository.FlatmateDocumentRepository;
import com.houseclay.backend.repository.RentDocumentRepository;
import com.houseclay.backend.repository.SaleDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PropertyElasticService {

    @Autowired
    private SaleDocumentRepository saleDocumentRepository;
    @Autowired
    private RentDocumentRepository rentDocumentRepository;
    @Autowired
    private FlatmateDocumentRepository flatmateDocumentRepository;

    public void indexPropertyInElastic(Property property) {
        if (property instanceof SaleProperty sale) {
            SaleDocument saleDocument = new SaleDocument();
            copyBaseFields(property, saleDocument);
            saleDocument.setPrice(sale.getPrice());
            saleDocumentRepository.save(saleDocument);
        } else if (property instanceof RentProperty rent) {
            RentDocument rentDocument = new RentDocument();
            copyBaseFields(property, rentDocument);
            rentDocument.setRent(rent.getRent());
            rentDocument.setPreferredTenant(rent.getPreferredTenant());
            rentDocumentRepository.save(rentDocument);
        } else if (property instanceof FlatmateProperty flatmate) {
            FlatmateDocument flatmateDocument = new FlatmateDocument();
            copyBaseFields(property, flatmateDocument);
            flatmateDocument.setRent(flatmate.getRent());
            flatmateDocument.setTenantType(flatmate.getTenantType());
            flatmateDocument.setBalconyType(flatmate.getBalconyType());
            flatmateDocument.setBathroomType(flatmate.getBathroomType());
            flatmateDocument.setRoomType(flatmate.getRoomType());
            flatmateDocumentRepository.save(flatmateDocument);
        }
    }

    public void deletePropertyInElastic(Property property) {
        if (property instanceof SaleProperty sale) {
            saleDocumentRepository.deleteById(property.getPropertyID());
        } else if (property instanceof RentProperty rent) {
            rentDocumentRepository.deleteById(property.getPropertyID());
        } else if (property instanceof FlatmateProperty flatmate) {
            flatmateDocumentRepository.deleteById(property.getPropertyID());
        }
    }

    private void copyBaseFields(Property property, PropertyDocument propertyDocument) {
        propertyDocument.setId(property.getPropertyID());
        propertyDocument.setPropertyType(property.getPropertyType());
        propertyDocument.setBhkType(property.getBhkType());
        propertyDocument.setBuiltUpArea(property.getBuiltUpArea());
        propertyDocument.setFurnishing(property.getFurnishing());
        propertyDocument.setCity(property.getCity());
        propertyDocument.setLocationOrSocietyName(property.getLocationOrSocietyName());
        propertyDocument.setLandmark(property.getLandmark());
        propertyDocument.setAvailableFrom(property.getAvailableFrom().getTime());
        propertyDocument.setParking(property.getParking());
        propertyDocument.setImages(property.getImages());
        propertyDocument.setAmenities(property.getAmenities());
        propertyDocument.setBathrooms(property.getBathrooms());
        propertyDocument.setExclusive(property.isPremium());
        propertyDocument.setCreatedOn(System.currentTimeMillis());
        propertyDocument.setLocation(new PropertyDocument.GeoPoint(property.getLatitude(), property.getLongitude()));
    }
}
