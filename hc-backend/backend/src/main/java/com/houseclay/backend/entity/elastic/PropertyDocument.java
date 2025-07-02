package com.houseclay.backend.entity.elastic;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.GeoPointField;

import java.sql.Timestamp;
import java.util.List;

@Data
public class PropertyDocument {

    @Id
    private String id;

    private String propertyType;
    private Double builtUpArea;
    private String bhkType;
    private String furnishing;
    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private Timestamp availableFrom;
    private Boolean parking;

    @Field(type = FieldType.Keyword)
    private List<String> images;

    @Field(type = FieldType.Keyword)
    private List<String> amenities;

    @GeoPointField
    private GeoPoint location;

    // Add other searchable fields as needed

    @Data
    public static class GeoPoint {
        private double lat;
        private double lon;

        public GeoPoint() {}

        public GeoPoint(double lat, double lon) {
            this.lat = lat;
            this.lon = lon;
        }
    }
}
