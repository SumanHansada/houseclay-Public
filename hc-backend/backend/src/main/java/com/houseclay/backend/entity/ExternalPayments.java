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
    private String paymentId;
    private double amount;
    private ExternalPaymentStatus status;
    private String signature;
    private String razorPaymentId;
    private Timestamp createdAt;
    private Timestamp completedAt;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User user;
}
