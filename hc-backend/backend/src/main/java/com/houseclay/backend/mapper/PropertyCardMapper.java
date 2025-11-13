package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.PropertyCardDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.entity.elastic.FlatmateDocument;
import com.houseclay.backend.entity.elastic.PropertyDocument;
import com.houseclay.backend.entity.elastic.RentDocument;
import com.houseclay.backend.entity.elastic.SaleDocument;
import com.houseclay.backend.utils.PropertyUtils;

public class PropertyCardMapper {

    public static PropertyCardDTO toPropertyCardDTO(PropertyDocument propertyDocument) {
        PropertyCardDTO dto = new PropertyCardDTO();
        copyBaseFields(propertyDocument, dto);
        if (propertyDocument instanceof SaleDocument sale) {
            dto.setPrice(sale.getPrice());
            dto.setPropertyCategory(PropertyCategory.RESALE);
        } else if (propertyDocument instanceof RentDocument rent) {
            dto.setRent(rent.getRent());
            dto.setPropertyCategory(PropertyCategory.RENT);
        } else if (propertyDocument instanceof FlatmateDocument flatmate) {
            dto.setRent(flatmate.getRent());
            dto.setPropertyCategory(PropertyCategory.FLATMATE);
        }
        return dto;
    }

    public static PropertyCardDTO toPropertyCardDTO(Property property) {
        PropertyCardDTO dto = new PropertyCardDTO();
        copyBaseFields(property, dto);
        if (property instanceof SaleProperty sale) {
            dto.setPrice(sale.getPrice());
        } else if (property instanceof RentProperty rent) {
            dto.setRent(rent.getRent());
        } else if (property instanceof FlatmateProperty flatmate) {
            dto.setRent(flatmate.getRent());
        }
        return dto;
    }

    private static void copyBaseFields(PropertyDocument source, PropertyCardDTO target) {
        target.setPropertyID(source.getId());
        target.setPropertyType(source.getPropertyType());
        target.setBuiltUpArea(source.getBuiltUpArea());
        target.setBhkType(source.getBhkType());
        target.setFurnishing(source.getFurnishing());
        target.setCity(source.getCity());
        target.setLocationOrSocietyName(source.getLocationOrSocietyName());
        target.setLandmark(source.getLandmark());
        target.setLatitude(source.getLocation().getLat());
        target.setLongitude(source.getLocation().getLon());
        target.setBathrooms(source.getBathrooms());
        target.setImages(source.getImages());
    }

    private static void copyBaseFields(Property source, PropertyCardDTO target) {
        target.setPropertyID(source.getPropertyID());
        target.setPropertyType(source.getPropertyType());
        target.setBuiltUpArea(source.getBuiltUpArea());
        target.setBhkType(source.getBhkType());
        target.setFurnishing(source.getFurnishing());
        target.setCity(source.getCity());
        target.setLocationOrSocietyName(source.getLocationOrSocietyName());
        target.setLandmark(source.getLandmark());
        target.setLatitude(source.getLatitude());
        target.setLongitude(source.getLongitude());
        target.setPropertyState(source.getPropertyState());
        target.setBathrooms(source.getBathrooms());
        target.setPropertyCategory(PropertyUtils.getPropertyCategory(source));
        target.setImages(source.getImages());
    }
}
