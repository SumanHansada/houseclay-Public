package com.houseclay.backend.repository;

import com.houseclay.backend.entity.elastic.RentDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface RentDocumentRepository extends ElasticsearchRepository<RentDocument, String> {
}
