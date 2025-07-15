package com.houseclay.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.dto.AdminLoginDTO;
import com.houseclay.backend.dto.AdminRegisterDTO;
import com.houseclay.backend.entity.Admin;
import com.houseclay.backend.repository.AdminRepository;
import com.houseclay.backend.utils.AdminUtil;
import org.hamcrest.Matchers;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminUtil adminUtil;

    private static String authToken;


    @BeforeAll
    public void init() throws Exception {
       authToken = adminUtil.createAdminLogin();
    }

    @AfterAll
    public void cleanup() throws Exception {
        adminUtil.deleteAdmin(AdminUtil.TEST_ADMIN_USERNAME);
    }

    public record AdminRegisterTestCase(
            String username,
            String password,
            String name,
            int expectedStatus,
            String expectedResponseMessage
    ) {}

    private static Stream<Arguments> provideAdminRegisterTestCases() {
        return Stream.of(
                Arguments.of(new AdminRegisterTestCase("testadmin1", "pass123", "rohit", 200, "Admin registered successfully")),
                Arguments.of(new AdminRegisterTestCase("testadmin2", "", "rohit", 400, "Password cannot be empty")),
                Arguments.of(new AdminRegisterTestCase("", "password3", "rohit" ,400, "Username cannot be empty")),
                Arguments.of(new AdminRegisterTestCase("testadmin1", "pass123", "", 400, "Name cannot be empty")),
                Arguments.of(new AdminRegisterTestCase(AdminUtil.TEST_ADMIN_USERNAME, AdminUtil.TEST_ADMIN_PASSWORD, "rohit", 400, "Username already exists"))
        );
    }

    @Order(1)
    @ParameterizedTest
    @MethodSource("provideAdminRegisterTestCases")
    public void testRegisterAdmin(AdminRegisterTestCase testCase) throws Exception {
        AdminRegisterDTO dto = new AdminRegisterDTO();
        dto.setUsername(testCase.username());
        dto.setPassword(testCase.password());
        dto.setName(testCase.name());

        mockMvc.perform(post("/api/admin/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().is(testCase.expectedStatus()))
                .andExpect(content().string(Matchers.containsString(testCase.expectedResponseMessage())));

        if (testCase.expectedStatus() == 200) {
            Optional<Admin> admin = adminRepository.findByUsername(testCase.username());
            assertTrue(admin.isPresent());
        }
    }

    public record AdminLoginTestCase(
            String username,
            String password,
            int expectedStatus,
            String expectedResponseMessage
    ) {}

    private static Stream<Arguments> provideAdminLoginTestCases() {
        return Stream.of(
                Arguments.of(new AdminLoginTestCase(AdminUtil.TEST_ADMIN_USERNAME, AdminUtil.TEST_ADMIN_PASSWORD, 200, "")),
                Arguments.of(new AdminLoginTestCase(AdminUtil.TEST_ADMIN_USERNAME, "", 400, "Password cannot be empty")),
                Arguments.of(new AdminLoginTestCase("", AdminUtil.TEST_ADMIN_PASSWORD ,400, "Username cannot be empty")),
                Arguments.of(new AdminLoginTestCase("invalid", AdminUtil.TEST_ADMIN_PASSWORD ,400, "Incorrect username")),
                Arguments.of(new AdminLoginTestCase(AdminUtil.TEST_ADMIN_USERNAME, "invalid" ,400, "Incorrect password"))
        );
    }

    @Order(2)
    @ParameterizedTest
    @MethodSource("provideAdminLoginTestCases")
    public void testLoginAdmin(AdminLoginTestCase testCase) throws Exception {
        AdminLoginDTO dto = new AdminLoginDTO();
        dto.setUsername(testCase.username());
        dto.setPassword(testCase.password());

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().is(testCase.expectedStatus()))
                .andExpect(content().string(Matchers.containsString(testCase.expectedResponseMessage())));
    }

    public record LogoutTestCase(
            String authHeader,
            int expectedStatus,
            String expectedMessagePart
    ) {}

    private static Stream<Arguments> provideLogoutTestCases() {
        return Stream.of(
                Arguments.of(new LogoutTestCase(
                        "Bearer "+authToken,
                        200,
                        "Logout successful"
                )),
                Arguments.of(new LogoutTestCase(
                        "Bearer invalid-token",
                        401,
                        "Invalid or expired token"
                )),
                Arguments.of(new LogoutTestCase(
                        "BadFormatToken",
                        401,
                        "Missing or invalid token"
                )),
                Arguments.of(new LogoutTestCase(
                        "",  // Empty header
                        401,
                        "Missing or invalid token"
                ))
        );
    }

    @Order(3)
    @ParameterizedTest
    @MethodSource("provideLogoutTestCases")
    public void testLogoutAdmin(LogoutTestCase testCase) throws Exception {
        mockMvc.perform(post("/api/admin/logout")
                        .header("Authorization", testCase.authHeader()))
                .andExpect(status().is(testCase.expectedStatus()))
                .andExpect(content().string(Matchers.containsString(testCase.expectedMessagePart())));
    }
}

