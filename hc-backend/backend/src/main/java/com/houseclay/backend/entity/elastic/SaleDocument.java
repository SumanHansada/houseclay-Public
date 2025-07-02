package com.houseclay.backend.entity.elastic;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "sale_properties")
public class SaleDocument extends PropertyDocument {

    private Double price;
}
