package com.houseclay.backend.utils;

import com.houseclay.backend.entity.Property;

import java.sql.Timestamp;
import java.util.List;

public class PropertyConstants {

    public static Property getValidSaleProperty() {
        Property property = new Property();
        property.setPropertyID("df994c71-4e59-455f-957d-142b0c9af00f");
        property.setCity("Bengaluru");
        property.setLocationOrSocietyName("Krishvi Gavakshi");
        property.setLandmark("Close to ORR, Bengaluru, Karnataka, Krishvi Gavakshi, Gear School Rd, Kaverappa Layout, Kadubeesanahalli, Bengaluru, Karnataka 560103, India");
        property.setLatitude(12.935784);
        property.setLongitude(77.697332);
        property.setImages(List.of(
                "blob:http://ec2-54-79-199-42.ap-southeast-2.compute.amazonaws.com:3000/fa603c50-491d-45d2-8066-31fbf2943951"
        ));
        property.setPropertyType("Apartment");
        property.setBuiltUpArea(2500.0);
        property.setFacing("East");
        property.setBhkType("3BHK");
        property.setPropertyAge("More than 10 year");
        property.setFloor(0);
        property.setTotalFloors(2);
        property.setFloorType("Mosaic");
        property.setDescription("Top floor nicely placed. This lovely three bedroom for sale is only 1.95 Crores rupees without any extra brokerage & could be your new home. This West facing home is over 1536 sqft. & is in a convenient location.");
        property.setWaterSupply("borewell");
        property.setPowerBackup("partial");
        property.setFurnishing("Semi-funnished");
        property.setParking("2 wheeler");
        property.setBathrooms(3);
        property.setAvailableFrom(Timestamp.valueOf("2025-05-31 18:30:00"));
        property.setAmenities(List.of(
                "Lift",
                "Gated Security",
                "Pool",
                "Fire Extinguisher",
                "Smoke Alarm"
        ));
        return property;
    }
}
