package com.houseclay.backend.service;

import co.elastic.clients.elasticsearch._types.GeoLocation;
import co.elastic.clients.json.JsonData;
import com.houseclay.backend.dto.PaginatedResponse;
import com.houseclay.backend.dto.PropertyCardDTO;
import com.houseclay.backend.entity.PropertyCategory;
import com.houseclay.backend.entity.elastic.FlatmateDocument;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.houseclay.backend.entity.elastic.RentDocument;
import com.houseclay.backend.entity.elastic.SaleDocument;
import com.houseclay.backend.mapper.PropertyCardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class SearchService {

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    @Autowired
    private PhotoService photoService;

    public PaginatedResponse<PropertyCardDTO> searchNearbyWithFilters(
            double lat,
            double lon,
            String distance,
            String city,
            String bhkType,
            Double minPrice,
            Double maxPrice,
            PropertyCategory propertyCategory,
            String furnishing,
            String propertyType,
            String parking,
            String preferredTenant,
            List<String> amenities,
            int page,
            int size
    ) {

        // Build the list of filters (geo + field filters)
        List<Query> filters = new ArrayList<>();

        List<Double> coordinates = new ArrayList<Double>(Arrays.asList(lon, lat));
        // Geo filter
        filters.add(Query.of(q -> q
                .geoDistance(g -> g
                        .field("location")
                        .distance(distance)
                        .location(
                                new GeoLocation.Builder()
                                        .coords(coordinates)
                                        .build()
                        )
                )
        ));

        // City filter
        if (city != null && !city.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("city.keyword").value(city))
            ));
        }

        // BHK type filter
        if (bhkType != null && !bhkType.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("bhkType.keyword").value(bhkType))
            ));
        }

        if (furnishing != null && !furnishing.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("furnishing.keyword").value(furnishing))
            ));
        }

        if (propertyType != null && !propertyType.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("propertyType.keyword").value(propertyType))
            ));
        }

        if (preferredTenant != null && !preferredTenant.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("preferredTenant.keyword").value(preferredTenant))
            ));
        }

        if (parking != null && !parking.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("parking.keyword").value(parking))
            ));
        }

        if (amenities != null && !amenities.isEmpty()) {
            List<Query> mustQueries = amenities.stream()
                    .map(amenity -> Query.of(q -> q
                            .term(t -> t
                                    .field("amenities.keyword")
                                    .value(amenity)
                            )
                    ))
                    .toList();

            filters.add(Query.of(q -> q
                    .bool(b -> b
                            .must(mustQueries)
                    )
            ));
        }

        addRangeFilter(minPrice, maxPrice, filters, propertyCategory);

        // Wrap filters inside a bool query
        Query boolQuery = Query.of(q -> q
                .bool(b -> b.filter(filters))
        );

        Pageable pageable = PageRequest.of(page, size);

        // Build the query
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(boolQuery)
                .withPageable(pageable)
                .build();


        return switch (propertyCategory) {
            case RESALE -> mapPage(
                    elasticsearchOperations.search(searchQuery, SaleDocument.class),
                    pageable,
                    hit -> {
                        SaleDocument d = hit.getContent();
                        String img = safeFirstImageUrl(d.getImages());
                        return PropertyCardMapper.toPropertyCardDTO(d, img);
                    }
            );
            case RENT -> mapPage(
                    elasticsearchOperations.search(searchQuery, RentDocument.class),
                    pageable,
                    hit -> {
                        RentDocument d = hit.getContent();
                        String img = safeFirstImageUrl(d.getImages());
                        return PropertyCardMapper.toPropertyCardDTO(d, img);
                    }
            );
            case FLATMATE -> mapPage(
                    elasticsearchOperations.search(searchQuery, FlatmateDocument.class),
                    pageable,
                    hit -> {
                        FlatmateDocument d = hit.getContent();
                        String img = safeFirstImageUrl(d.getImages());
                        return PropertyCardMapper.toPropertyCardDTO(d, img);
                    }
            );
        };
    }

    private String safeFirstImageUrl(List<String> images) {
        if (images == null || images.isEmpty()) return null;
        return photoService.getObjectPresignedUrl(images.get(0));
    }

    private <T> PaginatedResponse<PropertyCardDTO> mapPage(
            SearchHits<T> hits,
            Pageable pageable,
            java.util.function.Function<SearchHit<T>, PropertyCardDTO> mapper
    ) {
        // Convert to a SearchPage to get total easily
        SearchPage<T> page = SearchHitSupport.searchPageFor(hits, pageable);
        List<PropertyCardDTO> items = page.getContent().stream().map(mapper).toList();

        long total = page.getTotalElements();
        int totalPages = page.getTotalPages();
        boolean hasNext = page.hasNext();

        return new PaginatedResponse<>(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                total,
                totalPages,
                hasNext,
                items
        );
    }

    private void addRangeFilter(Double minPrice, Double maxPrice, List<Query> filters, PropertyCategory propertyCategory) {
        if (minPrice != null || maxPrice != null) {
            String fieldName = "price";
            switch (propertyCategory) {
                case RESALE -> {
                    fieldName = "price";
                }
                case RENT, FLATMATE -> {
                    fieldName = "rent";
                }
            }
            String finalFieldName = fieldName;
            filters.add(Query.of(q -> q
                    .range(r -> r
                            .field(finalFieldName)
                            .gte(JsonData.of(minPrice))
                            .lte(JsonData.of(maxPrice))
                    )
            ));
        }
    }

}
