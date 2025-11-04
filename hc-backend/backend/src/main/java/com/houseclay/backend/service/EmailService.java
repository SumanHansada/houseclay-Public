package com.houseclay.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.config.Msg91Config;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.utils.Msg91Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private Msg91Config msg91Config;

    private static final String EMAIL_SEND_URL = "https://control.msg91.com/api/v5/email/send";
    private static final String OTP_TEMPLATE_ID = "email_otp_verification_6";

    public void sendOTPEmail(String email, String name, String otp) throws Exception {
        Map<String, String> variables = new HashMap<>();
        variables.put("otp", otp);

        Map<String, Object> body = getEmailBodyMap(email, name, variables, OTP_TEMPLATE_ID);

        JsonNode jsonNode = sendEmail(body);
        String type = jsonNode.path("status").asText();

        if (!"success".equalsIgnoreCase(type)) {
            String message = jsonNode.path("message").asText();
            System.err.println("❌ Email OTP send failed: " + message);
            throw new APIException("Email OTP send failed", HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            System.out.println("✅ Email OTP sent successfully to " + email);
        }
    }

    private JsonNode sendEmail(Map<String, Object> body) throws Exception {
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, Msg91Utils.getOtpHeaders(msg91Config.getAuthKey()));
        ResponseEntity<String> response = restTemplate.postForEntity(EMAIL_SEND_URL, request, String.class);
        return objectMapper.readTree(response.getBody());
    }

    private Map<String, Object> getEmailBodyMap(String email, String name, Map<String, String> variables, String templateID) {
        Map<String, Object> recipient = new HashMap<>();
        Map<String, String> toEmail = new HashMap<>();
        toEmail.put("email", email);
        toEmail.put("name", name);

        recipient.put("to", List.of(toEmail));
        recipient.put("variables", variables);

        Map<String, Object> body = new HashMap<>();
        body.put("recipients", List.of(recipient));
        body.put("from", Map.of("email", "no-reply@mail.houseclay.com"));
        body.put("domain", "mail.houseclay.com");
        body.put("template_id", "global_otp");
        return body;
    }

}
