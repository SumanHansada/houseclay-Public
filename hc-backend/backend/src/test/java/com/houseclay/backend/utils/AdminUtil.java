package com.houseclay.backend.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.houseclay.backend.dto.AdminLoginDTO;
import com.houseclay.backend.dto.AdminRegisterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;


@Component
public class AdminUtil {

    public static final String TEST_ADMIN_USERNAME = "test_admin";
    public static final String TEST_ADMIN_PASSWORD = "test_password";
    public static final String TEST_ADMIN_NAME = "test_name";

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    public void createAdmin() throws Exception {
        AdminRegisterDTO dto = new AdminRegisterDTO();
        dto.setUsername(TEST_ADMIN_USERNAME);
        dto.setPassword(TEST_ADMIN_PASSWORD);
        dto.setName(TEST_ADMIN_NAME);
        MvcResult result = mockMvc.perform(post("/api/admin/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andReturn();
        MockHttpServletResponse response = result.getResponse();

        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new RuntimeException("Expected 200 OK but got " + response.getStatus() + ": " + response.getContentAsString());
        }
    }

    public String createAdminLogin() throws Exception {
        createAdmin();
        AdminLoginDTO dto = new AdminLoginDTO();
        dto.setUsername(TEST_ADMIN_USERNAME);
        dto.setPassword(TEST_ADMIN_PASSWORD);

        MvcResult result = mockMvc.perform(post("/api/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andReturn();
        MockHttpServletResponse response = result.getResponse();
        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new RuntimeException("Expected 200 OK but got " + response.getStatus() + ": " + response.getContentAsString());
        }
        return response.getContentAsString();
    }

    public void deleteAdmin(String username) throws Exception {
        MvcResult result = mockMvc.perform(delete("/test-utils/delete-admin")
                        .param("username", username))
                .andReturn();
        MockHttpServletResponse response = result.getResponse();
        System.out.println(response.getContentAsString());
        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new RuntimeException("Expected 200 OK but got " + response.getStatus() + ": " + response.getContentAsString());
        }
    }
}
