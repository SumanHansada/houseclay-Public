package com.houseclay.backend.dto;

import com.houseclay.backend.entity.ConnectSourceType;
import com.houseclay.backend.entity.ConnectStatus;
import lombok.Data;

import java.util.List;


@Data
public class ConnectDTO {
    private String connectId;
    private String propertyID;
    private ConnectStatus status;
    private ConnectSourceType sourceType;
    List<ConnectEventDTO> connectEvents;
}
