package com.houseclay.backend.service;

import com.houseclay.backend.entity.FlatmateProperty;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyState;
import com.houseclay.backend.entity.RentProperty;
import com.houseclay.backend.entity.SaleProperty;
import com.houseclay.backend.entity.elastic.FlatmateDocument;
import com.houseclay.backend.entity.elastic.PropertyDocument;
import com.houseclay.backend.entity.elastic.RentDocument;
import com.houseclay.backend.entity.elastic.SaleDocument;
import com.houseclay.backend.repository.FlatmateDocumentRepository;
import com.houseclay.backend.repository.PropertyRepository;
import com.houseclay.backend.repository.RentDocumentRepository;
import com.houseclay.backend.repository.SaleDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyElasticService {

    @Autowired
    private SaleDocumentRepository saleDocumentRepository;
    @Autowired
    private RentDocumentRepository rentDocumentRepository;
    @Autowired
    private FlatmateDocumentRepository flatmateDocumentRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    public void indexPropertyInElastic(Property property) {
        if (property instanceof SaleProperty sale) {
            SaleDocument saleDocument = new SaleDocument();
            copyBaseFields(property, saleDocument);
            saleDocument.setPrice(sale.getPrice());
            saleDocumentRepository.save(saleDocument);
        } else if (property instanceof RentProperty rent) {
            RentDocument rentDocument = new RentDocument();
            copyBaseFields(property, rentDocument);
            rentDocument.setRent(rent.getRent());
            rentDocument.setPreferredTenant(rent.getPreferredTenant());
            rentDocumentRepository.save(rentDocument);
        } else if (property instanceof FlatmateProperty flatmate) {
            FlatmateDocument flatmateDocument = new FlatmateDocument();
            copyBaseFields(property, flatmateDocument);
            flatmateDocument.setRent(flatmate.getRent());
            flatmateDocument.setTenantType(flatmate.getTenantType());
            flatmateDocument.setBalconyType(flatmate.getBalconyType());
            flatmateDocument.setBathroomType(flatmate.getBathroomType());
            flatmateDocument.setRoomType(flatmate.getRoomType());
            flatmateDocument.setNonVegAllowed(flatmate.isNonVegAllowed());
            flatmateDocumentRepository.save(flatmateDocument);
        }
    }

    public void deletePropertyInElastic(Property property) {
        if (property instanceof SaleProperty sale) {
            saleDocumentRepository.deleteById(property.getPropertyID());
        } else if (property instanceof RentProperty rent) {
            rentDocumentRepository.deleteById(property.getPropertyID());
        } else if (property instanceof FlatmateProperty flatmate) {
            flatmateDocumentRepository.deleteById(property.getPropertyID());
        }
    }

    private void copyBaseFields(Property property, PropertyDocument propertyDocument) {
        propertyDocument.setId(property.getPropertyID());
        propertyDocument.setPropertyType(property.getPropertyType());
        propertyDocument.setBhkType(property.getBhkType());
        propertyDocument.setBuiltUpArea(property.getBuiltUpArea());
        propertyDocument.setFurnishing(property.getFurnishing());
        propertyDocument.setCity(property.getCity());
        propertyDocument.setLocationOrSocietyName(property.getLocationOrSocietyName());
        propertyDocument.setLandmark(property.getLandmark());
        propertyDocument.setAvailableFrom(property.getAvailableFrom().getTime());
        propertyDocument.setParking(property.getParking());
        propertyDocument.setImages(property.getImages());
        propertyDocument.setCoverImage(property.getCoverImage());
        propertyDocument.setAmenities(property.getAmenities());
        propertyDocument.setBathrooms(property.getBathrooms());
        propertyDocument.setExclusive(property.isPremium());
        propertyDocument.setCreatedOn(System.currentTimeMillis());
        propertyDocument.setPropertyState(property.getPropertyState() != null ? property.getPropertyState().name() : null);
        propertyDocument.setLocation(new PropertyDocument.GeoPoint(property.getLatitude(), property.getLongitude()));
    }

    /**
     * Re-indexes eligible properties from Postgres into Elasticsearch in batches.
     *
     * When to call this:
     *   - After adding or changing a field on any PropertyDocument subclass, to backfill
     *     existing ES documents from the source-of-truth in Postgres.
     *   - Trigger via the admin-only endpoint: POST /api/property/admin/reindex
     *
     * How it works:
     *   1. Reads only properties in ACTIVE, PENDING_ROUTINE_CHECK, or PENDING_RE_VERIFICATION
     *      states from Postgres in pages of 100.
     *   2. For each property, calls indexPropertyInElastic() which overwrites the ES document
     *      (same propertyID = same ES _id, so it's a full replace, not a partial update).
     *
     * States excluded from ES (PENDING_VERIFICATION, INACTIVE) are not searchable.
     *
     * NOTE: This operation is idempotent and safe to call multiple times.
     */
    public void reindexAllProperties() {
        // Step 1: Remove any ES documents for states that should not be searchable
        List<PropertyState> excludedStates = List.of(
                PropertyState.PENDING_VERIFICATION,
                PropertyState.INACTIVE
        );
        int page = 0;
        int pageSize = 100;
        Page<Property> batch;
        do {
            batch = propertyRepository.findByPropertyStateIn(excludedStates, PageRequest.of(page, pageSize));
            batch.forEach(this::deletePropertyInElastic);
            page++;
        } while (batch.hasNext());

        // Step 2: Re-index all eligible properties
        List<PropertyState> indexableStates = List.of(
                PropertyState.ACTIVE,
                PropertyState.PENDING_ROUTINE_CHECK,
                PropertyState.PENDING_RE_VERIFICATION
        );
        page = 0;
        do {
            batch = propertyRepository.findByPropertyStateIn(indexableStates, PageRequest.of(page, pageSize));
            batch.forEach(this::indexPropertyInElastic);
            page++;
        } while (batch.hasNext());
    }
}
