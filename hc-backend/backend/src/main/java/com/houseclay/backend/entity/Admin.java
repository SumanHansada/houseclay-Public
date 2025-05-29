package com.houseclay.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Admin {

    @Id
    String username;
    String password;
    String name;
    enum role {
        CAPTAIN,
        ADMIN
    }

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    List<User> blacklistedUsers;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    List<AdminLogin> adminLogins;
}
