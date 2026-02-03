package com.houseclay.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Admin {

    @Id
    private String username;
    private String password;
    private String name;
    private String phoneNo;
    private String secondaryPhoneNo;
    private String personalEmail;
    private String address;

    private Timestamp dateOfJoining;
    private Timestamp dateOfBirth;
    private boolean active = true;

    private AdminRole role;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AdminLogin> adminLogins = new ArrayList<>();

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserUpdateLog> userUpdateLogs;

    @Override
    public String toString() {
        return "Admin{" +
                ", name='" + name + '\'' +
                '}';
    }

}
