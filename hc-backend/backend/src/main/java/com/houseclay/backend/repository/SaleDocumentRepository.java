package com.houseclay.backend.repository;

import com.houseclay.backend.entity.elastic.SaleDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SaleDocumentRepository extends ElasticsearchRepository<SaleDocument, String> {
}
