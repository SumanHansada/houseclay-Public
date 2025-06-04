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
        @JsonSubTypes.Type(value = SaleProperty.class, name = "Sale"),
        @JsonSubTypes.Type(value = RentProperty.class, name = "Rent"),
        @JsonSubTypes.Type(value = FlatmateProperty.class, name = "Flatmate")
})
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // All properties in one table
@DiscriminatorColumn(name = "property_type", discriminatorType = DiscriminatorType.STRING)
@Table(name = "properties")
@Data
public class Property {

    @Id
    String propertyID;
    String title;
    String propertyType;
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

    @ElementCollection
    private List<String> images;

    @ElementCollection
    private List<String> amenities;

    @ElementCollection
    private List<String> preferredTenants;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User owner;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PropertyAction> propertyActions;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ReportProperty> reportedProperties;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PropertyUpdateLog> propertUpdateLogs = new ArrayList<>();

    @OneToOne
    @NotFound(action= NotFoundAction.IGNORE)
    ConnectTransaction connectTransaction;
}
