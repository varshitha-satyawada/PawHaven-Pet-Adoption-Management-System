package com.pawhaven.dto;

import com.pawhaven.model.PetStatus;
import jakarta.validation.constraints.*;

public record PetRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Size(max = 40) String species,
        @Size(max = 80) String breed,
        @NotNull @Min(0) @Max(60) Integer age,
        @NotBlank @Size(max = 20) String gender,
        @Size(max = 1200) String description,
        @Size(max = 500) String imageUrl,
        PetStatus status
) {}
