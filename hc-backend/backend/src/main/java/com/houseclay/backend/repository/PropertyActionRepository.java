package com.houseclay.backend.repository;

import com.houseclay.backend.entity.ActionType;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.PropertyAction;
import com.houseclay.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyActionRepository extends JpaRepository<PropertyAction, Integer> {
    void deleteByUserAndPropertyAndActionType(User user, Property property, ActionType actionType);
    List<PropertyAction> findByUserAndActionType(User user, ActionType actionType);
}
