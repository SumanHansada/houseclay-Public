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
    private String transactionId;
    private int connectQuantity;
    private Timestamp transactionTime;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User user;

    @OneToOne(mappedBy="connectTransaction")
    @NotFound(action=NotFoundAction.IGNORE)
    private Property property;

    @OneToOne(mappedBy="connectTransaction", cascade = CascadeType.ALL)
    @NotFound(action=NotFoundAction.IGNORE)
    private ExternalPayments externalPayments;
}
