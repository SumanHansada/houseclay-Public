package com.houseclay.backend.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ConnectTransactionDTO {
    String transactionId;
    int connectQuantity;
    Timestamp transactionTime;
}
