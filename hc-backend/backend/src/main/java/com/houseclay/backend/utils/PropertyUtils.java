package com.houseclay.backend.utils;

import com.houseclay.backend.dto.FlatmatePropertyDTO;
import com.houseclay.backend.dto.PropertyDTO;
import com.houseclay.backend.dto.RentPropertyDTO;
import com.houseclay.backend.dto.SalePropertyDTO;
import com.houseclay.backend.entity.*;

public class PropertyUtils {

    public static String getTitle(Property property) {
        return property.getBhkType()+" in "+ property.getLocationOrSocietyName()+" for "+ getPropertyCategory(property);
    }

    public static PropertyCategory getPropertyCategory(Property property) {
        if(property instanceof SaleProperty)
            return PropertyCategory.RESALE;
        if(property instanceof RentProperty)
            return PropertyCategory.RENT;
        if(property instanceof FlatmateProperty)
            return PropertyCategory.FLATMATE;
        return null;
    }

    public static Property getPropertyObj(PropertyDTO propertyDTO) {
        if (propertyDTO instanceof SalePropertyDTO) {
            return new SaleProperty();
        }
        if (propertyDTO instanceof RentPropertyDTO) {
            return new RentProperty();
        }
        if (propertyDTO instanceof FlatmatePropertyDTO) {
            return new FlatmateProperty();
        }
        return new Property();
    }
}
