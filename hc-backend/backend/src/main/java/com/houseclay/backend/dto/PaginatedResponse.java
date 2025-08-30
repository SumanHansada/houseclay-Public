package com.houseclay.backend.dto;

import java.util.List;

public record PaginatedResponse<T>(
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext,
        List<T> items
) {}
