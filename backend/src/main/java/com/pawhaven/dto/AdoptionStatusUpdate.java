package com.pawhaven.dto;

import com.pawhaven.model.AdoptionStatus;
import jakarta.validation.constraints.NotNull;

public record AdoptionStatusUpdate(@NotNull AdoptionStatus status) {}
