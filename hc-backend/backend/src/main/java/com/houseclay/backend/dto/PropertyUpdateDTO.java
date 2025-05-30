package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyUpdateType;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class PropertyUpdateDTO {

    PropertyUpdateType updateType;

    Timestamp updateTime;

    String updateBy;

    String userType;
}
