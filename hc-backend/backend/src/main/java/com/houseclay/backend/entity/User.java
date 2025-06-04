package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table( name = "users")
@Data
public class User {

    @Id
    private String phoneNo;
    private String name;
    private String emailID;
    private int connectBal;
    private boolean isBlacklisted;
    private boolean isDeleted;
    private Timestamp createdAt;
    private Timestamp blacklistedAt;
    private Timestamp deletedAt;

    public User(String phoneNo, String name, String emailID) {
        this.phoneNo = phoneNo;
        this.name = name;
        this.emailID = emailID;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.userLogins = new LinkedList<>();
        this.ownedProperties = new LinkedList<>();
    }

    @ManyToOne
    @JoinColumn(name = "username")
    private Admin admin;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Property> ownedProperties;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyAction> propertyActions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReportProperty> reportedProperties;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExternalPayments> externalPayments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConnectTransaction> connectTransactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLogin> userLogins;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lead> leads;

    public User() {

    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + phoneNo +
                ", username='" + name + '\'' +
                '}';
    }
}

