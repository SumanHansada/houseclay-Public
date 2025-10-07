package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.utils.PropertyUtils;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserLoginResponseDTO toUserLoginResponseDTO(User user) {
        UserLoginResponseDTO userLoginResponseDTO = new UserLoginResponseDTO();
        userLoginResponseDTO.setName(user.getName());
        userLoginResponseDTO.setEmailID(user.getEmailID());
        userLoginResponseDTO.setPhoneNo(user.getPhoneNo());
        userLoginResponseDTO.setConnectBal(user.getConnectBal());
        return userLoginResponseDTO;
    }

    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmailID());
        userDTO.setPhoneNo(user.getPhoneNo());
        userDTO.setName(user.getName());
        userDTO.setBlacklisted(user.isBlacklisted());
        return userDTO;
    }

    public static UserDetailDTO toDetailDTO(User user) {
        UserDetailDTO dto = new UserDetailDTO();
        dto.setPhoneNo(user.getPhoneNo());
        dto.setName(user.getName());
        dto.setEmail(user.getEmailID());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setBlacklisted(user.isBlacklisted());
        dto.setBroker(user.isBroker());

        dto.setUserUpdates(user.getUserUpdateLogs().stream()
                .map(UserMapper::toUserUpdateDTO)
                .collect(Collectors.toList()));

        dto.setOwnedProperties(
                user.getOwnedProperties().stream()
                        .map(UserMapper::toUserPropertyDTO)
                        .collect(Collectors.toList())
        );

        dto.setShortlistedProperties(
                user.getPropertyActions().stream()
                        .filter(action -> Objects.equals(action.getUserActionType(), UserActionType.SHORTLIST))
                        .map(action -> toUserPropertyDTO(action.getProperty()))
                        .collect(Collectors.toList())
        );

        dto.setViewedProperties(
                user.getPropertyActions().stream()
                        .filter(action -> Objects.equals(action.getUserActionType(), UserActionType.VIEW))
                        .map(action -> toUserPropertyDTO(action.getProperty()))
                        .collect(Collectors.toList())
        );

        dto.setContactedProperties(
                user.getPropertyActions().stream()
                        .filter(action -> Objects.equals(action.getUserActionType(), UserActionType.CONTACT))
                        .map(action -> toUserPropertyDTO(action.getProperty()))
                        .collect(Collectors.toList())
        );

        dto.setExternalPayments(
                user.getExternalPayments().stream()
                        .map(UserMapper::toExternalPaymentDTO)
                        .collect(Collectors.toList())
        );

        dto.setConnectTransactions(
                user.getConnects().stream()
                        .map(UserMapper::toConnectDTO)
                        .collect(Collectors.toList())
        );

        dto.setReportProperties(
                user.getReportedProperties().stream()
                        .map(UserMapper::toReportPropertyDTO)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    public static UserProfileDTO toUserProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmailID());
        dto.setPhoneNo(user.getPhoneNo());
        dto.setConnectBal(user.getConnectBal());

        dto.setOwnedProperties(
                user.getOwnedProperties().stream()
                        .map(PropertyMapper::toBasicEntity)
                        .collect(Collectors.toList())
        );

        dto.setShortlistedProperties(
                user.getPropertyActions().stream()
                        .filter(action -> Objects.equals(action.getUserActionType(), UserActionType.SHORTLIST))
                        .map(action -> PropertyCardMapper.toPropertyCardDTO(action.getProperty()))
                        .collect(Collectors.toList())
        );

        dto.setContactedProperties(
                user.getPropertyActions().stream()
                        .filter(action -> Objects.equals(action.getUserActionType(), UserActionType.CONTACT))
                        .map(action -> PropertyCardMapper.toPropertyCardDTO(action.getProperty()))
                        .collect(Collectors.toList())
        );

        dto.setExternalPayments(
                user.getExternalPayments().stream()
                        .map(UserMapper::toUserExternalPaymentDTO)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    public static UserPropertyDTO toUserPropertyDTO(Property property) {
        UserPropertyDTO dto = new UserPropertyDTO();
        dto.setPropertyID(property.getPropertyID());
        dto.setPropertyState(property.getPropertyState());
        dto.setPropertyCategory(PropertyUtils.getPropertyCategory(property));
        dto.setBhkType(property.getBhkType());
        dto.setLocation(property.getLocationOrSocietyName());
        dto.setAvailableFrom(property.getAvailableFrom());
        dto.setCreatedOn(getCreateTimestamp(property));
        dto.setUpdatedOn(getUpdateTimestamp(property));
        return dto;
    }

    private static ExternalPaymentDTO toExternalPaymentDTO(ExternalPayments payment) {
        ExternalPaymentDTO dto = new ExternalPaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setSignature(payment.getSignature());
        dto.setRazorPaymentId(payment.getRazorPaymentId());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setCompletedAt(payment.getCompletedAt());
        return dto;
    }

    private static UserExternalPaymentDTO toUserExternalPaymentDTO(ExternalPayments payment) {
        UserExternalPaymentDTO dto = new UserExternalPaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setCompletedAt(payment.getCompletedAt());
        return dto;
    }

    private static ConnectDTO toConnectDTO(Connect connect) {
        ConnectDTO dto = new ConnectDTO();
        dto.setConnectId(dto.getConnectId());
        dto.setStatus(connect.getStatus());
        dto.setSourceType(connect.getSourceType());
        if (connect.getProperty() != null) {
            dto.setPropertyID(connect.getProperty().getPropertyID());
        }
        dto.setConnectEvents(
                connect.getEvents().stream()
                        .map(UserMapper::toConnectEventDTO)
                        .collect(Collectors.toList())
        );
        return dto;
    }

    private static ReportPropertyDTO toReportPropertyDTO(ReportProperty reportProperty) {
        ReportPropertyDTO dto = new ReportPropertyDTO();
        dto.setReportId(reportProperty.getReportId());
        dto.setReportType(reportProperty.getReportType());
        dto.setReportTime(reportProperty.getReportTime());
        dto.setUserProperty(toUserPropertyDTO(reportProperty.getProperty()));
        return dto;
    }

    public static Timestamp getCreateTimestamp(Property property) {
        return property.getPropertyUpdateLogs().stream()
                .filter(log -> log.getUpdateType() == PropertyUpdateType.CREATE)
                .map(PropertyUpdateLog::getUpdatedAt)
                .findFirst().orElse(null);
    }

    public static Timestamp getUpdateTimestamp(Property property) {
        return property.getPropertyUpdateLogs().stream()
                .filter(log -> log.getUpdateType() == PropertyUpdateType.UPDATE)
                .map(PropertyUpdateLog::getUpdatedAt)
                .max(Comparator.naturalOrder()).orElse(null);
    }

    public static UserUpdateDTO toUserUpdateDTO(UserUpdateLog userUpdateLog) {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setUpdateType(userUpdateLog.getUserUpdateType());
        dto.setUpdateBy(userUpdateLog.getAdmin().getUsername());
        dto.setUpdateTime(userUpdateLog.getUpdatedAt());
        dto.setComment(userUpdateLog.getComment());
        return dto;
    }

    public static ConnectEventDTO toConnectEventDTO(ConnectEvent connectEvent) {
        ConnectEventDTO dto = new ConnectEventDTO();
        dto.setActor(connectEvent.getActorType());
        dto.setType(connectEvent.getEventType());
        dto.setEventTime(connectEvent.getEventTime());
        dto.setNotes(connectEvent.getNotes());
        return dto;
    }
}


