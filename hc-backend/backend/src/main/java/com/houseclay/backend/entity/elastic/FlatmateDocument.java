package com.houseclay.backend.entity.elastic;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "flatmate_properties")
public class FlatmateDocument extends PropertyDocument {

    private Double rent;
    private String tenantType;
    private String roomType;
    private String bathroomType;
    private String balconyType;
    private Boolean nonVegAllowed;

}
