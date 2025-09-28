package com.houseclay.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import freemarker.template.TemplateExceptionHandler;

@Configuration
public class SesConfig {
    @Bean
    SesClient sesClient(@Value("${aws.region}") String region) {
        return SesClient.builder().region(Region.of(region)).build();
    }

    @Bean
    freemarker.template.Configuration freemarkerCfg() {
        freemarker.template.Configuration cfg =
                new freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_32);
        cfg.setClassLoaderForTemplateLoading(getClass().getClassLoader(), "/templates"); // classpath:/templates
        cfg.setDefaultEncoding("UTF-8");
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        return cfg;
    }
}
