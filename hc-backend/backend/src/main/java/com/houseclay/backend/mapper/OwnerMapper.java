package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.OwnerDetailDTO;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;

public class OwnerMapper {

    public static OwnerDetailDTO toOwnerDetailDTO(User user, Property property) {
        OwnerDetailDTO ownerDetailDTO = new OwnerDetailDTO();
        ownerDetailDTO.setName(user.getName());
        ownerDetailDTO.setPhoneNo(user.getPhoneNo());
        ownerDetailDTO.setEmailID(user.getEmailID());
        ownerDetailDTO.setSecondaryPhoneNo(property.getSecondaryPhoneNumber());
        return ownerDetailDTO;
    }
}
