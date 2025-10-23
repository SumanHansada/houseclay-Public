package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.utils.PropertyUtils;

public class PropertyMapper {


    public static PropertyDTO toBasicDTO(Property property) {
        if (property instanceof SaleProperty sale) {
            SalePropertyDTO dto = new SalePropertyDTO();
            copyBaseFields(sale, dto);
            dto.setOwnershipType(sale.getOwnershipType());
            dto.setPriceNegotiable(sale.getPriceNegotiable());
            dto.setUnderLoan(sale.getUnderLoan());
            dto.setPrice(sale.getPrice());
            dto.setBalcony(sale.getBalcony());
            dto.setKhataCertificate(sale.getKhataCertificate());
            dto.setSaleDeed(sale.getSaleDeed());
            dto.setPropertyTax(sale.getPropertyTax());
            return dto;
        } else if (property instanceof RentProperty rent) {
            RentPropertyDTO dto = new RentPropertyDTO();
            copyBaseFields(rent, dto);
            dto.setRent(rent.getRent());
            dto.setDeposit(rent.getDeposit());
            dto.setMaintenanceCharges(rent.getMaintenanceCharges());
            dto.setRentNegotiable(rent.getRentNegotiable());
            dto.setPreferredTenant(rent.getPreferredTenant());
            dto.setPetsAllowed(rent.getPetsAllowed());
            dto.setNonVegAllowed(rent.getNonVegAllowed());
            return dto;
        } else if (property instanceof FlatmateProperty flatmate) {
            FlatmatePropertyDTO dto = new FlatmatePropertyDTO();
            copyBaseFields(flatmate, dto);
            dto.setRent(flatmate.getRent());
            dto.setMaintenanceCharges(flatmate.getMaintenanceCharges());
            dto.setDepositCharges(flatmate.getDepositCharges());
            dto.setTenantType(flatmate.getTenantType());
            dto.setAttachedBathroom(flatmate.getAttachedBathroom());
            dto.setAttachedBalcony(flatmate.getAttachedBalcony());
            dto.setSmokingPreference(flatmate.getSmokingPreference());
            dto.setDrinkingPreference(flatmate.getDrinkingPreference());
            return dto;
        } else {
            PropertyDTO dto = new PropertyDTO();
            copyBaseFields(property, dto);
            return dto;
        }
    }

    public static OwnedPropertyDTO toBasicEntity(Property property) {
        OwnedPropertyDTO dto = new OwnedPropertyDTO();
        copyBaseFields(property, dto);
        if(property instanceof SaleProperty sale) {
            dto.setPrice(sale.getPrice());
        }
        if(property instanceof RentProperty rent) {
            dto.setPrice(rent.getRent());
        }
        if(property instanceof FlatmateProperty flatmate) {
            dto.setPrice(flatmate.getRent());
        }
        return dto;
    }

    public static void copyBaseFields(Property source, OwnedPropertyDTO target) {
        target.setPropertyID(source.getPropertyID());
        target.setPropertyType(source.getPropertyType());
        target.setBhkType(source.getBhkType());
        target.setLocationOrSocietyName(source.getLocationOrSocietyName());
        target.setAvailableFrom(source.getAvailableFrom());
        target.setPropertyState(source.getPropertyState().toString());
        target.setBuiltUpArea(source.getBuiltUpArea());
    }

    private static void copyBaseFields(Property source, PropertyDTO target) {
        target.setPropertyID(source.getPropertyID());
        target.setTitle(source.getTitle());
        target.setPropertyType(source.getPropertyType());
        target.setManaged(source.isManaged());
        target.setPremium(source.isPremium());
        target.setBuiltUpArea(source.getBuiltUpArea());
        target.setFacing(source.getFacing());
        target.setBathrooms(source.getBathrooms());
        target.setBhkType(source.getBhkType());
        target.setFloor(source.getFloor());
        target.setTotalFloors(source.getTotalFloors());
        target.setFloorType(source.getFloorType());
        target.setDescription(source.getDescription());
        target.setCity(source.getCity());
        target.setLocationOrSocietyName(source.getLocationOrSocietyName());
        target.setLandmark(source.getLandmark());
        target.setLatitude(source.getLatitude());
        target.setLongitude(source.getLongitude());
        target.setFurnishing(source.getFurnishing());
        target.setPropertyAge(source.getPropertyAge());
        target.setWaterSupply(source.getWaterSupply());
        target.setPowerBackup(source.getPowerBackup());
        target.setParking(source.getParking());
        target.setAvailableFrom(source.getAvailableFrom());
        target.setPropertyState(source.getPropertyState());
        target.setImages(source.getImages());
        target.setCoverImage(source.getCoverImage());
        target.setAmenities(source.getAmenities());
        target.setPreferredTenants(source.getPreferredTenants());
        target.setPropertyCategory(PropertyUtils.getPropertyCategory(source));
    }
}
