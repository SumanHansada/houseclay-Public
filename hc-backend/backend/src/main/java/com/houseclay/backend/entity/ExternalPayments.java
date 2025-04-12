package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.sql.Timestamp;

@Entity
@Data
public class ExternalPayments {

    @Id
    String paymentId;
    double amount;
    public enum Status {
        IN_PROGRESS,
        COMPLETED,
        FAILED
    }
    Status status;
    String signature;
    String razorPaymentId;
    Timestamp createdAt;
    Timestamp completedAt;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User user;

    @OneToOne
    @NotFound(action= NotFoundAction.IGNORE)
    ConnectTransaction connectTransaction;
}
