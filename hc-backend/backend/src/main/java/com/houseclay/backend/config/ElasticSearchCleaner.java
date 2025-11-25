package com.houseclay.backend.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.DeleteByQueryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ElasticSearchCleaner implements ApplicationRunner {

    @Autowired
    private ElasticsearchClient client;

    private static final List<String> indexes = List.of("sale_properties", "rent_properties", "flatmate_properties");

    @Override
    public void run(ApplicationArguments args) throws Exception {
        for (String index : indexes) {
            deleteIndex(index);
        }
    }

    private void deleteIndex(String indexName) throws Exception {
//        DeleteByQueryResponse response = client.deleteByQuery(d -> d
//                .index(indexName)
//                .query(q -> q.matchAll(m -> m))
//        );
//        System.out.println("Deleted documents count: " + response.deleted());
    }
}
