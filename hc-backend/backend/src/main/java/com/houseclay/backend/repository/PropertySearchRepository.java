package com.houseclay.backend.repository;

import com.houseclay.backend.entity.PropertyDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface PropertySearchRepository extends ElasticsearchRepository<PropertyDocument, Long> {
}
