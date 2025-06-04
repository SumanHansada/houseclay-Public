package com.houseclay.backend.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ConnectTransactionDTO {
    private String transactionId;
    private int connectQuantity;
    private Timestamp transactionTime;
}
