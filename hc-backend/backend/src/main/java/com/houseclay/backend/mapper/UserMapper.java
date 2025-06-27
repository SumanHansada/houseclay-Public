package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.utils.PropertyUtils;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserMapper {

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
        dto.setBlacklistedAt(user.getBlacklistedAt());

        if (user.getAdmin() != null) {
            dto.setBlacklistedBy(user.getAdmin().getUsername());
        }

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
                user.getConnectTransactions().stream()
                        .map(UserMapper::toConnectTransactionDTO)
                        .collect(Collectors.toList())
        );

        dto.setReportProperties(
                user.getReportedProperties().stream()
                        .map(UserMapper::toReportPropertyDTO)
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

    private static ConnectTransactionDTO toConnectTransactionDTO(ConnectTransaction transaction) {
        ConnectTransactionDTO dto = new ConnectTransactionDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setConnectQuantity(transaction.getConnectQuantity());
        dto.setTransactionTime(transaction.getTransactionTime());
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
        return property.getPropertUpdateLogs().stream()
                .filter(log -> log.getUpdateType() == PropertyUpdateType.CREATE)
                .map(PropertyUpdateLog::getUpdatedAt)
                .findFirst().orElse(null);
    }

    public static Timestamp getUpdateTimestamp(Property property) {
        return property.getPropertUpdateLogs().stream()
                .filter(log -> log.getUpdateType() == PropertyUpdateType.UPDATE)
                .map(PropertyUpdateLog::getUpdatedAt)
                .max(Comparator.naturalOrder()).orElse(null);
    }
}

