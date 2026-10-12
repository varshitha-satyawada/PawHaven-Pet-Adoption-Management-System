package com.pawhaven.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdoptionRequestCreate(@NotNull Long petId, @Size(max = 1000) String message) {}
