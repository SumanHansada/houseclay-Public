package com.houseclay.backend.repository;

import com.houseclay.backend.entity.elastic.FlatmateDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface FlatmateDocumentRepository extends ElasticsearchRepository<FlatmateDocument, String> {
}
