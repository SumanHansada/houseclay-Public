package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class BundleDTO {
    private String id;
    private String title;
    private String subTitle;
    private int connects;
    private double standardPrice;
}
