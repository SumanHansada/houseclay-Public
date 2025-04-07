package com.houseclay.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    String phoneNo;
    String name;
    String emailID;
    int connectBal;
    boolean isBlacklisted;
    boolean isDeleted;
    Timestamp createdAt;
    Timestamp blacklistedAt;
    Timestamp deletedAt;

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
    Admin admin;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Property> ownedProperties;

    @ManyToMany
    List<Property> shortlistedProperties;

    @ManyToMany
    List<Property> contactedProperties;

    @ManyToMany
    List<Property> viewedProperties;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ReportProperty> reportedProperties;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ExternalPayments> externalPayments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ConnectTransaction> connectTransactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<UserLogin> userLogins;

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

