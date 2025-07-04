package com.houseclay.backend.entity;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "propertyCategory", // this field tells Jackson what subclass to use
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = SaleProperty.class, name = "RESALE"),
        @JsonSubTypes.Type(value = RentProperty.class, name = "RENT"),
        @JsonSubTypes.Type(value = FlatmateProperty.class, name = "FLATMATE")
})
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // All properties in one table
@DiscriminatorColumn(name = "property_category", discriminatorType = DiscriminatorType.STRING)
@Table(name = "properties")
@Data
public class Property {

    @Id
    private String propertyID;
    private String title;
    private String propertyType;
    boolean isManaged;
    boolean isPremium;

    private Double builtUpArea;
    private String facing;
    private String bhkType;
    private Integer floor;
    private Integer totalFloors;
    private String floorType;

    @Column(length = 1000)
    private String description;

    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private Double latitude;
    private Double longitude;
    private String furnishing;
    private String propertyAge;
    private String waterSupply;
    private String powerBackup;
    private Boolean parking;
    private Timestamp availableFrom;
    private PropertyState propertyState;
    private String coverImage;

    @ElementCollection
    private List<String> images;

    @ElementCollection
    private List<String> amenities;

    @ElementCollection
    private List<String> preferredTenants;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User owner;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyAction> propertyActions = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReportProperty> reportedProperties;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyUpdateLog> propertyUpdateLogs = new ArrayList<>();

    @OneToOne
    @NotFound(action= NotFoundAction.IGNORE)
    private ConnectTransaction connectTransaction;
}
