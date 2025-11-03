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

    public static void toBasicEntity(PropertyDTO dto, Property target) {
        if (dto instanceof SalePropertyDTO saleDTO && target instanceof SaleProperty sale) {
            copyBaseFields(saleDTO, sale);
            sale.setOwnershipType(saleDTO.getOwnershipType());
            sale.setPriceNegotiable(saleDTO.getPriceNegotiable());
            sale.setUnderLoan(saleDTO.getUnderLoan());
            sale.setPrice(saleDTO.getPrice());
            sale.setBalcony(saleDTO.getBalcony());
            sale.setKhataCertificate(saleDTO.getKhataCertificate());
            sale.setSaleDeed(saleDTO.getSaleDeed());
            sale.setPropertyTax(saleDTO.getPropertyTax());
        } else if (dto instanceof RentPropertyDTO rentDTO && target instanceof RentProperty rent) {
            copyBaseFields(rentDTO, rent);
            rent.setRent(rentDTO.getRent());
            rent.setDeposit(rentDTO.getDeposit());
            rent.setMaintenanceCharges(rentDTO.getMaintenanceCharges());
            rent.setRentNegotiable(rentDTO.getRentNegotiable());
            rent.setPreferredTenant(rentDTO.getPreferredTenant());
            rent.setPetsAllowed(rentDTO.getPetsAllowed());
            rent.setNonVegAllowed(rentDTO.getNonVegAllowed());
        } else if (dto instanceof FlatmatePropertyDTO flatmateDTO && target instanceof FlatmateProperty flatmate) {
            copyBaseFields(flatmateDTO, flatmate);
            flatmate.setRent(flatmateDTO.getRent());
            flatmate.setMaintenanceCharges(flatmateDTO.getMaintenanceCharges());
            flatmate.setDepositCharges(flatmateDTO.getDepositCharges());
            flatmate.setTenantType(flatmateDTO.getTenantType());
            flatmate.setAttachedBathroom(flatmateDTO.getAttachedBathroom());
            flatmate.setAttachedBalcony(flatmateDTO.getAttachedBalcony());
            flatmate.setSmokingPreference(flatmateDTO.getSmokingPreference());
            flatmate.setDrinkingPreference(flatmateDTO.getDrinkingPreference());
        } else {
            // Base case (for generic PropertyDTO or mismatched types)
            copyBaseFields(dto, target);
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

    private static void copyBaseFields(PropertyDTO source, Property target) {
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
    }

}
