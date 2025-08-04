package com.houseclay.backend.dto;

import com.houseclay.backend.entity.ActorType;
import com.houseclay.backend.entity.ConnectEventType;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class ConnectEventDTO  {
    private ConnectEventType type;
    private ActorType actor;
    private Timestamp eventTime;
    private String notes;
}
