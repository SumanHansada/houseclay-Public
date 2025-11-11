package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.OwnerDetailDTO;
import com.houseclay.backend.entity.User;

public class OwnerMapper {

    public static OwnerDetailDTO toOwnerDetailDTO(User user) {
        OwnerDetailDTO ownerDetailDTO = new OwnerDetailDTO();
        ownerDetailDTO.setName(user.getName());
        ownerDetailDTO.setPhoneNo(user.getPhoneNo());
        ownerDetailDTO.setEmailID(user.getEmailID());
        return ownerDetailDTO;
    }
}
