package com.houseclay.backend.service;

import com.amazonaws.services.cloudfront.CloudFrontCookieSigner;
import com.amazonaws.services.cloudfront.util.SignerUtils;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.Base64;
import java.security.PrivateKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.KeyFactory;

@Service
public class CloudFrontCookieService {

    @Value("${cloudfront.private-key}")
    private String privateKeyPem;

    private static final String KEY_PAIR_ID = "K17ZTW5NPXMRFP";
    private static final String DISTRIBUTION_DOMAIN = "cdn.houseclay.com";

    public Map<String, ResponseCookie> generateSignedCookies() throws Exception {
        String resourcePath = "https://" + DISTRIBUTION_DOMAIN + "/properties/*" ;
        Date expires = Date.from(Instant.now().plusSeconds(3600)); // 1 hour validity
        PrivateKey privateKey = loadPrivateKeyFromPem(privateKeyPem);

        CloudFrontCookieSigner.CookiesForCustomPolicy cookies =
                CloudFrontCookieSigner.getCookiesForCustomPolicy(
                        SignerUtils.Protocol.https,
                        DISTRIBUTION_DOMAIN,
                        privateKey,
                        resourcePath,
                        KEY_PAIR_ID,
                        expires,
                        null,
                        null
                );

        // Convert to Spring-friendly ResponseCookies
        ResponseCookie policyCookie = ResponseCookie.from(cookies.getPolicy().getKey(), cookies.getPolicy().getValue())
                .domain(DISTRIBUTION_DOMAIN)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();

        ResponseCookie signatureCookie = ResponseCookie.from(cookies.getSignature().getKey(), cookies.getSignature().getValue())
                .domain(DISTRIBUTION_DOMAIN)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();

        ResponseCookie keyPairCookie = ResponseCookie.from(cookies.getKeyPairId().getKey(), cookies.getKeyPairId().getValue())
                .domain(DISTRIBUTION_DOMAIN)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();

        return Map.of(
                cookies.getPolicy().getKey(), policyCookie,
                cookies.getSignature().getKey(), signatureCookie,
                cookies.getKeyPairId().getKey(), keyPairCookie
        );
    }

    private PrivateKey loadPrivateKeyFromPem(String pem) throws Exception {
        String sanitizedPem = pem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        byte[] keyBytes = Base64.getDecoder().decode(sanitizedPem);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePrivate(keySpec);
    }
}
