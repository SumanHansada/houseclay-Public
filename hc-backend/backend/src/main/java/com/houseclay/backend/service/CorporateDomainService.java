package com.houseclay.backend.service;

import com.houseclay.backend.entity.CorporateDomain;
import com.houseclay.backend.enums.CorporateDomainStatus;
import com.houseclay.backend.repository.CorporateDomainRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.houseclay.backend.utils.Constants;

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

    // In-memory set for disposable emails
    private final Set<String> disposableDomains = new HashSet<>(Constants.DISPOSABLE_DOMAIN_LIST);

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
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
        if (corporateDomainRepository.findByDomainName(domain).isPresent()) {
            return;
        }

        String title = null;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://" + domain))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String html = response.body();

            // Simple regex to extract <title>...</title>
            Pattern titlePattern = Pattern.compile("<title>(.*?)</title>", Pattern.CASE_INSENSITIVE);
            Matcher matcher = titlePattern.matcher(html);
            if (matcher.find()) {
                title = matcher.group(1).trim();
                // truncate to 255 chars max
                if (title.length() > 255) {
                    title = title.substring(0, 255);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch metadata for domain {}: {}", domain, e.getMessage());
            // It's okay to fail, we will just save without a title
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
}
