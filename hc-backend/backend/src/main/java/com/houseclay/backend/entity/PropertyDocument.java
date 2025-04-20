package com.houseclay.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.GeoPointField;

@Data
@Document(indexName = "properties")
public class PropertyDocument {

    @Id
    private String id;

    private String title;
    private String city;
    private String description;

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
