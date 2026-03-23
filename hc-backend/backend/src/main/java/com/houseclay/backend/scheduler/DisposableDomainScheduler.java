package com.houseclay.backend.scheduler;

import com.houseclay.backend.service.CorporateDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DisposableDomainScheduler {

    private final CorporateDomainService corporateDomainService;

    // The GitHub raw URL for the disposable email domains blocklist
    @Value("${app.disposable-domains.url}")
    private String disposableDomainUrl;

    // Setup HTTP client
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    @Value("classpath:disposable_email_blocklist.conf")
    private Resource fallbackResource;

    @PostConstruct
    public void init() {
        log.info("Initializing disposable domain blocklist...");
        fetchAndLoadDisposableDomains();
    }

    /**
     * Scheduled to run every week (Sunday at midnight)
     * Cron expression: "0 0 0 * * 0" (second, minute, hour, day of month, month, day of week)
     */
    @Scheduled(cron = "0 0 0 * * 0")
    public void fetchAndLoadDisposableDomains() {
        log.info("Starting weekly fetch of disposable email domains...");
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(disposableDomainUrl))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 400) {
                Set<String> domains = parseDomains(response.body());
                if (!domains.isEmpty()) {
                    corporateDomainService.updateDisposableDomains(domains);
                    log.info("Successfully loaded {} disposable domains from remote URL.", domains.size());
                    return; // Success, we are done
                }
            } else {
                log.warn("Non-successful HTTP response for disposable domains fetch: Status {}", response.statusCode());
            }
        } catch (Exception e) {
            log.error("Failed to fetch disposable email domains from GitHub. Fallback will be triggered. Error: {}", e.getMessage());
        }

        // Fallback to local resource file if fetch failed
        loadFallbackDomains();
    }

    private void loadFallbackDomains() {
        try {
            if (fallbackResource.exists()) {
                try (InputStream is = fallbackResource.getInputStream();
                     BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                     
                    Set<String> domains = reader.lines()
                            .map(String::trim)
                            .filter(line -> !line.isEmpty() && !line.startsWith("#") && !line.startsWith("//"))
                            .map(String::toLowerCase)
                            .collect(Collectors.toSet());
                            
                    if (!domains.isEmpty()) {
                        corporateDomainService.updateDisposableDomains(domains);
                        log.info("Successfully loaded {} disposable domains from local fallback resource.", domains.size());
                    } else {
                        log.warn("Local fallback resource empty.");
                    }
                }
            } else {
                log.warn("Fallback resource for disposable domains not found!");
            }
        } catch (Exception e) {
            log.error("Failed to load fallback disposable domain file: {}", e.getMessage());
        }
    }

    private Set<String> parseDomains(String content) {
        Set<String> domains = new HashSet<>();
        String[] lines = content.split("\\r?\\n");
        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty() && !line.startsWith("#") && !line.startsWith("//")) {
                domains.add(line.toLowerCase());
            }
        }
        return domains;
    }
}
