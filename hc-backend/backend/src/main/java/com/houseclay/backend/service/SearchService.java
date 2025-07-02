package com.houseclay.backend.service;

import co.elastic.clients.elasticsearch._types.GeoLocation;
import com.houseclay.backend.dto.PropertyCardDTO;
import com.houseclay.backend.entity.PropertyCategory;
import com.houseclay.backend.entity.elastic.FlatmateDocument;
import com.houseclay.backend.entity.elastic.PropertyDocument;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.houseclay.backend.entity.elastic.RentDocument;
import com.houseclay.backend.entity.elastic.SaleDocument;
import com.houseclay.backend.mapper.PropertyCardMapper;
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

    @Autowired
    private PhotoService photoService;

    public List<PropertyCardDTO> searchNearbyWithFilters(
            double lat,
            double lon,
            String distance,
            String city,
            String bhkType,
            PropertyCategory propertyCategory,
            String furnishing,
            String propertyType,
            Boolean parking,
            String preferredTenant,
            List<String> amenities
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

        if (parking != null) {
            filters.add(Query.of(q -> q
                    .term(t -> t
                            .field("parking")
                            .value(parking)
                    )
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

        // Wrap filters inside a bool query
        Query boolQuery = Query.of(q -> q
                .bool(b -> b.filter(filters))
        );

        // Build the query
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(boolQuery)
                .build();


        return switch (propertyCategory) {
            case RESALE -> {
                SearchHits<SaleDocument> saleHits = elasticsearchOperations.search(searchQuery, SaleDocument.class);
                yield saleHits.stream()
                        .map(hit -> {
                            SaleDocument sale = hit.getContent();
                            String imageURL = photoService.getObjectPresignedUrl(sale.getImages().get(0));
                            return PropertyCardMapper.toPropertyCardDTO(sale, imageURL);
                        })
                        .toList();
            }
            case RENT -> {
                SearchHits<RentDocument> rentHits = elasticsearchOperations.search(searchQuery, RentDocument.class);
                yield rentHits.stream()
                        .map(hit -> {
                            RentDocument rent = hit.getContent();
                            String imageURL = photoService.getObjectPresignedUrl(rent.getImages().get(0));
                            return PropertyCardMapper.toPropertyCardDTO(rent, imageURL);
                        })
                        .toList();
            }
            case FLATMATE -> {
                SearchHits<FlatmateDocument> flatmateHits = elasticsearchOperations.search(searchQuery, FlatmateDocument.class);
                yield flatmateHits.stream()
                        .map(hit -> {
                            FlatmateDocument flatmate = hit.getContent();
                            String imageURL = photoService.getObjectPresignedUrl(flatmate.getImages().get(0));
                            return PropertyCardMapper.toPropertyCardDTO(flatmate, imageURL);
                        })
                        .toList();
            }
        };
    }

}
