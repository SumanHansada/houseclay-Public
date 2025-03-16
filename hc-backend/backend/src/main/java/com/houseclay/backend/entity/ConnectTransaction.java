package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.sql.Timestamp;

@Entity
@Data
public class ConnectTransaction {

    @Id
    String transactionId;
    int connectQuantity;
    Timestamp transactionTime;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User user;

    @OneToOne(mappedBy="connectTransaction")
    @NotFound(action=NotFoundAction.IGNORE)
    Property property;

    @OneToOne(mappedBy="connectTransaction")
    @NotFound(action=NotFoundAction.IGNORE)
    ExternalPayments externalPayments;
}
