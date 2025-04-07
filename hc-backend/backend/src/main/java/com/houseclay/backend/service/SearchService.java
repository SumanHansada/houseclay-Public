package com.houseclay.backend.service;

import co.elastic.clients.elasticsearch._types.GeoLocation;
import com.houseclay.backend.entity.PropertyDocument;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    public List<PropertyDocument> searchNearbyWithFilters(
            double lat,
            double lon,
            String distance,
            String city,
            String bhkType,
            String propertyCategory) {

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

        // Property category filter
        if (propertyCategory != null && !propertyCategory.isEmpty()) {
            filters.add(Query.of(q -> q
                    .term(t -> t.field("propertyCategory.keyword").value(propertyCategory))
            ));
        }

        // Wrap filters inside a bool query
        Query boolQuery = Query.of(q -> q
                .bool(b -> b.filter(filters))
        );

        // Build the query
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(boolQuery)
                .build();

        // Perform the search
        SearchHits<PropertyDocument> hits = elasticsearchOperations.search(searchQuery, PropertyDocument.class);

        // Return the documents
        return hits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }
}
