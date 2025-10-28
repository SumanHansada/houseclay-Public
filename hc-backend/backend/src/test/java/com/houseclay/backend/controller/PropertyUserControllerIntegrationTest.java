package com.houseclay.backend.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.payload.UserPayload;
import com.houseclay.backend.utils.PropertyConstants;
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
public class PropertyUserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserUtil userUtil;

    private String setCookieHeader;

    @BeforeAll
    public void init() throws Exception {
        userUtil.generateOTP();
        UserPayload userPayload = new UserPayload("9876543210", "Rohit", "rohit@example.com", "0000");
        setCookieHeader = userUtil.registerUser(objectMapper.writeValueAsString(userPayload));
    }

    public record AddPropertyTestCase(
            Property property,
            int expectedStatus
    ) {}

    private static Stream<Arguments> provideAddPropertyTestCases() {

        return Stream.of(
                Arguments.of(new AddPropertyTestCase(PropertyConstants.getValidSaleProperty(), 200))
        );
    }


    @Order(1)
    @ParameterizedTest
    @MethodSource("provideAddPropertyTestCases")
    public void testAddProperty(AddPropertyTestCase testCase) throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/property/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Cookie", setCookieHeader)
                        .content(objectMapper.writeValueAsString(testCase.property)))
                .andReturn();
        assertEquals(testCase.expectedStatus, result.getResponse().getStatus());
    }

}
