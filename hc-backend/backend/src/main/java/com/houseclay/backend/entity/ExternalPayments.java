package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Data
public class ExternalPayments {

    @Id
    String paymentId;
    double amount;
    enum Status {
        IN_PROGRESS,
        COMPLETED,
        FAILED
    }

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User user;

    @OneToOne
    @NotFound(action= NotFoundAction.IGNORE)
    ConnectTransaction connectTransaction;
}
