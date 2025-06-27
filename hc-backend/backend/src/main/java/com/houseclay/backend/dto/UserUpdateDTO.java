package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyUpdateType;
import com.houseclay.backend.entity.UserUpdateType;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserUpdateDTO {

    private UserUpdateType updateType;

    private Timestamp updateTime;

    private String updateBy;

    private String comment;
}
