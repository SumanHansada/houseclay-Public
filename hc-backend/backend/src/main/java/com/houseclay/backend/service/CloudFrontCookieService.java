package com.houseclay.backend.service;

import com.amazonaws.services.cloudfront.CloudFrontCookieSigner;
import com.amazonaws.services.cloudfront.util.SignerUtils;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class CloudFrontCookieService {

    private static final String KEY_PAIR_ID = "K17ZTW5NPXMRFP";
    private static final String PRIVATE_KEY_PATH = "/home/ec2-user/backend/private_key.pem";
    private static final String DISTRIBUTION_DOMAIN = ".houseclay.com";

    public Map<String, ResponseCookie> generateSignedCookies() throws Exception {
        String resourcePath = "https://" + DISTRIBUTION_DOMAIN + "/properties/*" ;
        Date expires = Date.from(Instant.now().plusSeconds(3600)); // 1 hour validity
        File privateKeyFile = new File(PRIVATE_KEY_PATH);

        CloudFrontCookieSigner.CookiesForCustomPolicy cookies =
                CloudFrontCookieSigner.getCookiesForCustomPolicy(
                        SignerUtils.Protocol.https,
                        DISTRIBUTION_DOMAIN,
                        privateKeyFile,
                        resourcePath,
                        KEY_PAIR_ID,
                        expires,
                        null,
                        null
                );

        // Convert to Spring-friendly ResponseCookies
        ResponseCookie policyCookie = ResponseCookie.from(cookies.getPolicy().getKey(), cookies.getPolicy().getValue())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain(DISTRIBUTION_DOMAIN)
                .path("/")
                .maxAge(86400)
                .build();

        ResponseCookie signatureCookie = ResponseCookie.from(cookies.getSignature().getKey(), cookies.getSignature().getValue())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain(DISTRIBUTION_DOMAIN)
                .path("/")
                .maxAge(86400)
                .build();

        ResponseCookie keyPairCookie = ResponseCookie.from(cookies.getKeyPairId().getKey(), cookies.getKeyPairId().getValue())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain(DISTRIBUTION_DOMAIN)
                .path("/")
                .maxAge(86400)
                .build();

        return Map.of(
                cookies.getPolicy().getKey(), policyCookie,
                cookies.getSignature().getKey(), signatureCookie,
                cookies.getKeyPairId().getKey(), keyPairCookie
        );
    }
}
