package com.houseclay.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.payload.UserPayload;
import com.houseclay.backend.utils.UserUtil;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserUtil userUtil;

    @BeforeAll
    public void init() throws Exception {
        userUtil.generateOTP();
    }

    public record UserRegisterTestCase(
            UserPayload userPayload,
            int expectedStatus,
            String expectedResponseMessage
    ) {}

    private static Stream<Arguments> provideUserRegisterTestCases() {
        return Stream.of(
                Arguments.of(new UserRegisterTestCase(
                        new UserPayload(null, "Rohit", "rohit@example.com", "123456"), 400, "{\"phoneNo\":\"PhoneNo cannot be empty\"}")
                ),

                Arguments.of(new UserRegisterTestCase(
                        new UserPayload("9876543210", "", "rohit@example.com", "123456"), 400, "{\"name\":\"Name cannot be empty\"}")
                ),

                Arguments.of(new UserRegisterTestCase(
                        new UserPayload("9876543210", "Rohit", "rohit@example.com", ""), 400, "{\"otpCode\":\"OTP Code cannot be empty\"}")
                ),

                // Valid phone & name, invalid email
                Arguments.of(new UserRegisterTestCase(
                        new UserPayload("9876543210", "Rohit", "invalid-email", "123456"),
                        400, "{\"emailID\":\"Invalid email format\"}")
                ),

                // Invalid phone number
                Arguments.of(new UserRegisterTestCase(
                        new UserPayload("12345", "Rohit", "rohit@example.com", "123456"),
                        400, "{\"phoneNo\":\"Invalid phone number\"}")
                ),

                Arguments.of(new UserRegisterTestCase(
                        new UserPayload("9876543210", "Rohit", "rohit@example.com", "123456"),
                        400, "Invalid OTP Code")
                ),

                Arguments.of(new UserRegisterTestCase(
                        new UserPayload("9876543210", "Rohit", "rohit@example.com", "0000"),
                        200, "OK")
                )

        );
    }


    @Order(1)
    @ParameterizedTest
    @MethodSource("provideUserRegisterTestCases")
    public void testUserRegistration(UserRegisterTestCase testCase) throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCase.userPayload)))
                .andReturn();
        assertEquals(result.getResponse().getStatus(), testCase.expectedStatus);
        if (testCase.expectedStatus != 200) {
            assertEquals(testCase.expectedResponseMessage, result.getResponse().getContentAsString());
        }

    }

}
