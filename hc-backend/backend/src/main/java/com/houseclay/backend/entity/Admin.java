package com.houseclay.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Admin {

    @Id
    private String username;
    private String password;
    private String  name;

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
