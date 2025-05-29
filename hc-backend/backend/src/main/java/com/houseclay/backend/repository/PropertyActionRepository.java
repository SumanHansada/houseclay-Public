package com.houseclay.backend.repository;

import com.houseclay.backend.entity.UserActionType;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyAction;
import com.houseclay.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyActionRepository extends JpaRepository<PropertyAction, Integer> {
    void deleteByUserAndPropertyAndUserActionType(User user, Property property, UserActionType userActionType);
    List<PropertyAction> findByUserAndUserActionType(User user, UserActionType userActionType);
}
