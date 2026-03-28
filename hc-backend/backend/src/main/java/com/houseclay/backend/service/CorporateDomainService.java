package com.houseclay.backend.service;

import com.houseclay.backend.entity.CorporateDomain;
import com.houseclay.backend.enums.CorporateDomainStatus;
import com.houseclay.backend.repository.CorporateDomainRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.InitialDirContext;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class CorporateDomainService {

    private final CorporateDomainRepository corporateDomainRepository;
    
    // Pattern.DOTALL allows matching across newlines. 
    // [^>]* allows for attributes inside the title tag like <title id="main">
    private static final Pattern TITLE_PATTERN = Pattern.compile("<title[^>]*>(.*?)</title>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    // In-memory set for disposable emails
    private volatile Set<String> disposableDomains = new HashSet<>();

    /**
     * Updates the disposable domain blocklist in memory.
     */
    public void updateDisposableDomains(Set<String> newDomains) {
        if (newDomains != null && !newDomains.isEmpty()) {
            this.disposableDomains = Set.copyOf(newDomains);
        }
    }

    // Enable redirect following so domains like "houseclay.com" 
    // successfully redirect to "www.houseclay.com" instead of failing.
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .followRedirects(HttpClient.Redirect.NORMAL) 
            .build();

    /**
     * Extracts domain from email (e.g., user@houseclay.com -> houseclay.com)
     */
    public String extractDomain(String email) {
        if (email == null || !email.contains("@")) return null;
        return email.substring(email.lastIndexOf("@") + 1).toLowerCase().trim();
    }

    /**
     * Checks if the domain is in the disposable list.
     */
    public boolean isDisposable(String domain) {
        return disposableDomains.contains(domain);
    }

    /**
     * Checks the Database for the domain's status.
     * Returns Optional.empty() if the domain has never been processed.
     */
    public Optional<CorporateDomainStatus> getDomainStatusFromDb(String domain) {
        return corporateDomainRepository.findByDomainName(domain)
                .map(CorporateDomain::getStatus);
    }

    /**
     * Performs a Java DNS Lookup to check for MX Records with a strict 2-second timeout.
     * Implements a "Fail-Open" policy:
     * - Returns TRUE if MX records exist.
     * - Returns TRUE if a network error/timeout occurs (Fail-Open).
     * - Returns FALSE ONLY if the DNS explicitly responds with 0 MX records.
     */
    public boolean checkMxRecordsFailOpen(String domain) {
        Hashtable<String, String> env = new Hashtable<>();
        env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
        env.put("com.sun.jndi.dns.timeout.initial", "2000"); // 2 seconds strict timeout
        env.put("com.sun.jndi.dns.timeout.retries", "1");

        try {
            InitialDirContext dirContext = new InitialDirContext(env);
            Attributes attrs = dirContext.getAttributes(domain, new String[]{"MX"});
            Attribute mxAttr = attrs.get("MX");
            
            // If DNS successfully responds and explicitly has no MX records
            if (mxAttr == null || mxAttr.size() == 0) {
                log.info("DNS explicit response: No MX records found for domain: {}", domain);
                return false;
            }
            
            return true; // MX records exist
        } catch (NamingException e) {
            // Network error, timeout, or DNS server uncreachable -> Fail Open
            log.warn("DNS lookup failed or timed out for domain: {}, applying fail-open policy. Error: {}", domain, e.getMessage());
            return true; 
        }
    }

    /**
     * Asynchronously fetches the domain's website <title> tag and saves it to DB as PENDING.
     */
    @Async
    public void fetchMetadataAndSavePendingAsync(String domain) {
        // Prevent duplicate processing
        if (corporateDomainRepository.findByDomainName(domain).isPresent()) {
            return;
        }

        String title = null;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://" + domain))
                    // OPTIMIZATION 3: Add a User-Agent so WAFs/Cloudflare don't instantly block the Java client
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            // Only parse if we got a successful response
            if (response.statusCode() >= 200 && response.statusCode() < 400) {
                String html = response.body();
                Matcher matcher = TITLE_PATTERN.matcher(html);
                
                if (matcher.find()) {
                    // Clean up HTML entities, tabs, and newlines that might break the UI
                    title = matcher.group(1).trim().replaceAll("\\s+", " ");
                    
                    if (title.length() > 255) {
                        title = title.substring(0, 255);
                    }
                }
            } else {
                log.warn("Non-200 HTTP response for domain {}: Status {}", domain, response.statusCode());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch metadata for domain {}: {}", domain, e.getMessage());
        }

        // Fallback Logic
        // If the title is still null/empty due to a timeout, 403, or missing <title> tag.
        if (title == null || title.isEmpty()) {
            title = generateAdminFallbackTitle(domain);
        }

        try {
            // Save as PENDING
            CorporateDomain corporateDomain = new CorporateDomain();
            corporateDomain.setDomainName(domain);
            corporateDomain.setStatus(CorporateDomainStatus.PENDING);
            corporateDomain.setWebsiteTitle(title);
            corporateDomainRepository.save(corporateDomain);
        } catch (Exception e) {
            log.warn("Failed to save pending corporate domain {}: {}", domain, e.getMessage());
            // Ignore constraint violations if another thread saved it simultaneously
        }
    }

    /**
     * Generates a clear placeholder for the Admin UI if the actual website title couldn't be fetched.
     * Example: "google.co.in" -> "[Fetch Failed] Google"
     */
    private String generateAdminFallbackTitle(String domain) {
        try {
            // Extract the base word (e.g., "houseclay" from "houseclay.com")
            String baseName = domain;
            if (domain.contains(".")) {
                baseName = domain.substring(0, domain.indexOf('.'));
            }
            
            // Capitalize the first letter
            String capitalized = baseName.substring(0, 1).toUpperCase() + baseName.substring(1);
            
            // Add the Admin identifier prefix
            return "[Fetch Failed] " + capitalized;
        } catch (Exception e) {
            // Absolute worst-case scenario fallback
            return "[Fetch Failed] " + domain;
        }
    }
}
