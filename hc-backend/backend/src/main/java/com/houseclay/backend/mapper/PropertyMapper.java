package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class PropertyMapper {

    public static PropertyDTO toDTO(Property property) {
        if (property instanceof SaleProperty sale) {
            SalePropertyDTO dto = new SalePropertyDTO();
            copyBaseFields(sale, dto);
            dto.setOwnershipType(sale.getOwnershipType());
            dto.setPriceNegotiable(sale.getPriceNegotiable());
            dto.setUnderLoan(sale.getUnderLoan());
            dto.setPrice(sale.getPrice());
            dto.setBathrooms(sale.getBathrooms());
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

    private static void copyBaseFields(Property source, PropertyDTO target) {
        target.setPropertyID(source.getPropertyID());
        target.setTitle(source.getTitle());
        target.setPropertyType(source.getPropertyType());
        target.setManaged(source.isManaged());
        target.setPremium(source.isPremium());
        target.setBuiltUpArea(source.getBuiltUpArea());
        target.setFacing(source.getFacing());
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
        target.setAmenities(source.getAmenities());
        target.setPreferredTenants(source.getPreferredTenants());
        target.setPropertyCategory(source.getClass().getSimpleName().replace("Property", ""));

        if (source.getPropertUpdateLogs() != null) {
            List<PropertyUpdateDTO> updates = source.getPropertUpdateLogs().stream().map(updateLog -> {
                PropertyUpdateDTO dto = new PropertyUpdateDTO();
                dto.setUpdateType(updateLog.getUpdateType());
                dto.setUpdateTime(updateLog.getUpdatedAt());

                if (updateLog.getUpdatedByAdmin() != null) {
                    dto.setUpdateBy(updateLog.getUpdatedByAdmin().getUsername());
                    dto.setUserType("ADMIN");
                } else if (updateLog.getUpdatedByUser() != null) {
                    dto.setUpdateBy(updateLog.getUpdatedByUser().getPhoneNo());
                    dto.setUserType("USER");
                } else {
                    dto.setUpdateBy("UNKNOWN");
                    dto.setUserType("UNKNOWN");
                }

                return dto;
            }).toList();

            target.setPropertyUpdates(updates);
        }

        target.setOwner(UserMapper.toDTO(source.getOwner()));

        target.setContactUsers(source.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.CONTACT)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        target.setViewUsers(source.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.VIEW)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        target.setShortlistUsers(source.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.SHORTLIST)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        target.setReportUsers(source.getReportedProperties().stream()
                .map(PropertyMapper::toReportUserDTO)
                .collect(Collectors.toList()));

    }

    private static ReportUserDTO toReportUserDTO(ReportProperty reportProperty) {
        ReportUserDTO dto = new ReportUserDTO();
        dto.setReportId(reportProperty.getReportId());
        dto.setReportType(reportProperty.getReportType());
        dto.setReportTime(reportProperty.getReportTime());
        dto.setUser(UserMapper.toDTO(reportProperty.getUser()));
        return dto;
    }
}
