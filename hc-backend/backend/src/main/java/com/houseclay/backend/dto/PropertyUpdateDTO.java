package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyUpdateType;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class PropertyUpdateDTO {

    private PropertyUpdateType updateType;

    private Timestamp updateTime;

    private String updateBy;

    private String userType;
}
