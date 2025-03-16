package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long loginID;

    String token;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User user;


    public UserLogin(String token, User user) {
        this.token = token;
        this.user = user;
    }


    public UserLogin() {

    }
}
