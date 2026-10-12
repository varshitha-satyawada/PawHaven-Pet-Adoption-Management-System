package com.pawhaven.dto;

import com.pawhaven.model.AdoptionRequest;
import com.pawhaven.model.AdoptionStatus;
import java.time.LocalDateTime;

public record AdoptionResponse(
        Long id, Long petId, String petName, Long adopterId, String adopterName,
        String adopterEmail, String message, AdoptionStatus status, LocalDateTime requestedAt
) {
    public static AdoptionResponse from(AdoptionRequest request) {
        return new AdoptionResponse(
                request.getId(), request.getPet().getId(), request.getPet().getName(),
                request.getAdopter().getId(), request.getAdopter().getName(),
                request.getAdopter().getEmail(), request.getMessage(),
                request.getStatus(), request.getRequestedAt()
        );
    }
}
