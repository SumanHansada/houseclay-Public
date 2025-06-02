package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.UserDTO;
import com.houseclay.backend.entity.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmailID());
        userDTO.setPhoneNo(user.getPhoneNo());
        userDTO.setName(user.getName());
        return userDTO;
    }
}
