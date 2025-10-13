package com.houseclay.backend.service;

import co.elastic.clients.elasticsearch._types.DistanceUnit;
import co.elastic.clients.elasticsearch._types.GeoLocation;
import co.elastic.clients.elasticsearch._types.SortMode;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.json.JsonData;
import com.houseclay.backend.dto.*;
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
            PropertySearchRequestDTO request,
            int page,
            int size
    ) {

        // Build the list of filters (geo + field filters)
        List<Query> filters = new ArrayList<>();

        GeoLocation loc = GeoLocation.of(gl -> gl
                .latlon(ll -> ll.lat(request.getLat()).lon(request.getLon()))
        );
        // Geo filter
        filters.add(Query.of(q -> q
                .geoDistance(g -> g
                        .field("location")
                        .distance(request.getDistance())
                        .location(loc)
                )
        ));

        // City filter
        if (request.getCity() != null && !request.getCity().isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("city.keyword").value(request.getCity()))
            ));
        }

        if (request.getBhkType() != null && !request.getBhkType().isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("bhkType.keyword").value(request.getBhkType()))
            ));
        }

        if (request.getFurnishing() != null && !request.getFurnishing().isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("furnishing.keyword").value(request.getFurnishing()))
            ));
        }

        if (request.getPropertyType() != null && !request.getPropertyType().isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("propertyType.keyword").value(request.getPropertyType()))
            ));
        }

        if (request.getPreferredTenant() != null && !request.getPreferredTenant().isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("preferredTenant.keyword").value(request.getPreferredTenant()))
            ));
        }

        if (request.getParking() != null && !request.getParking().isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("parking.keyword").value(request.getParking()))
            ));
        }

        if (request.getIsExclusive() != null && request.getIsExclusive()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("isExclusive").value(true))
            ));
        }

        if (request.getAmenities() != null && !request.getAmenities().isEmpty()) {
            List<Query> mustQueries = request.getAmenities().stream()
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

        addRangeFilter(request.getMinPrice(), request.getMaxPrice(), filters, request.getPropertyCategory());

        // Wrap filters inside a bool query
        Query boolQuery = Query.of(q -> q
                .bool(b -> b.filter(filters))
        );

        Pageable pageable = PageRequest.of(page, size);

        if (request.getSortFields() == null ) {
            request.setSortFields(SortFields.DISTANCE);
        }
        if (request.getSortOrder() == null) {
            request.setSortOrder(SortOrder.ASC);
        }

        // Build the query
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(boolQuery)
                .withSort(List.of(buildSortOptions(request.getSortFields(), request.getSortOrder(), request.getPropertyCategory(), request.getLat(), request.getLon())))
                .withPageable(pageable)
                .build();


        return switch (request.getPropertyCategory()) {
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

    private SortOptions buildSortOptions(SortFields sortBy, SortOrder sortOrder, PropertyCategory category, double lat, double lon) {
        co.elastic.clients.elasticsearch._types.SortOrder order = (sortOrder == SortOrder.DESC) ? co.elastic.clients.elasticsearch._types.SortOrder.Desc : co.elastic.clients.elasticsearch._types.SortOrder.Asc;

        switch (sortBy) {
            case DISTANCE -> {
                GeoLocation point = GeoLocation.of(g -> g.latlon(l -> l.lat(lat).lon(lon)));
                return SortOptions.of(s -> s.geoDistance(g -> g
                        .field("location")
                        .location(point)
                        .order(order)
                        .unit(DistanceUnit.Kilometers)
                        .mode(SortMode.Min)
                ));
            }
            case PRICE -> {
                String field = switch (category) {
                    case RESALE -> "price";
                    case RENT, FLATMATE -> "monthlyRent";
                };
                return SortOptions.of(s -> s.field(f -> f
                        .field(field)
                        .order(order)
                        .missing("_last")
                ));
            }
            case AVAILABLE_FROM -> {
                return SortOptions.of(s -> s.field(f -> f
                        .field("availableFrom")
                        .order(order)
                        .missing("_last")
                ));
            }
            case POSTED_ON -> {
                return SortOptions.of(s -> s.field(f -> f
                        .field("createdOn")
                        .order(order)
                        .missing("_last")
                ));
            }
        }
        return SortOptions.of(s -> s.field(f -> f.field("createdOn").order(co.elastic.clients.elasticsearch._types.SortOrder.Desc)));
    }
}
