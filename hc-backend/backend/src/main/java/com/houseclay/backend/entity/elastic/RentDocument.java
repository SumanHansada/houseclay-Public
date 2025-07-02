package com.houseclay.backend.entity.elastic;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "rent_properties")
public class RentDocument extends PropertyDocument {

    private Double rent;
    private String preferredTenant;

}
