package com.houseclay.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.config.Msg91Config;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.utils.Msg91Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OTPService {

    @Autowired
    private Msg91Config config;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final int OTP_EXPIRY_MINUTES = 10;

    public void generateOTP(String phoneNo) throws Exception {
        String url = config.getBaseUrl() + "/otp";

        Map<String, Object> body = new HashMap<>();
        body.put("template_id", config.getTemplateId());
        body.put("mobile", phoneNo); // e.g. +919876543210
        body.put("otp_expiry", OTP_EXPIRY_MINUTES);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, Msg91Utils.getOtpHeaders(config.getAuthKey()));
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        String type = jsonNode.path("type").asText();

        if (!"success".equalsIgnoreCase(type)) {
            String message = jsonNode.path("message").asText();
            System.err.println("❌ OTP send failed: " + message);
            throw new APIException("OTP send failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public boolean validateOTP(String phoneNo, String otp) {
        String url = config.getBaseUrl() + "/otp/verify";

        Map<String, Object> body = new HashMap<>();
        body.put("mobile", phoneNo);
        body.put("otp", otp);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, Msg91Utils.getOtpHeaders(config.getAuthKey()));
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(response.getBody());
        } catch (JsonProcessingException e) {
            return false;
        }
        String type = jsonNode.path("type").asText();

        return "success".equalsIgnoreCase(type);
    }

    public void regenerateOTP(String phoneNo) throws Exception {
        String url = config.getBaseUrl() + "/otp/retry";

        Map<String, Object> body = new HashMap<>();
        body.put("mobile", phoneNo);
        body.put("retrytype", "TEXT");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, Msg91Utils.getOtpHeaders(config.getAuthKey()));
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        String type = jsonNode.path("type").asText();

        if (!"success".equalsIgnoreCase(type)) {
            String message = jsonNode.path("message").asText();
            System.err.println("❌ OTP resend failed: " + message);
            throw new APIException("OTP send failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
