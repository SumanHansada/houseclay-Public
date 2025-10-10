package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class BundleDTO {
    private String id;
    private String title;
    private String subTitle;
    private int connects;
    private double originalPrice;
    private double discountedPrice;
    private String discount;
    private String validity;
    private String borderColor;
    private String backgroundColor;
    private boolean selected;
    private boolean recommended; // not present in all objects (optional)
    private String background;
}
