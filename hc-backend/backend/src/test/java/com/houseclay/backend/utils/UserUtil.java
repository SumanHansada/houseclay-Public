package com.houseclay.backend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@Component
public class UserUtil {

    @Autowired
    MockMvc mockMvc;

    private static final String PHONE_NUMBER = "9876543210";

    public void generateOTP() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/generate-otp")
                        .param("phoneNo", PHONE_NUMBER)
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn();
        MockHttpServletResponse response = result.getResponse();

        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new RuntimeException("Expected 200 OK but got " + response.getStatus() + ": " + response.getContentAsString());
        }
    }


}

