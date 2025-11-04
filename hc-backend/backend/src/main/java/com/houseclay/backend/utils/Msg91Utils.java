package com.houseclay.backend.utils;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class Msg91Utils {

    public static HttpHeaders getOtpHeaders(String authKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("authkey", authKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
