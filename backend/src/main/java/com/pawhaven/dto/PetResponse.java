package com.pawhaven.dto;

import com.pawhaven.model.Pet;
import com.pawhaven.model.PetStatus;
import java.time.LocalDateTime;

public record PetResponse(
        Long id, String name, String species, String breed, Integer age,
        String gender, String description, String imageUrl, PetStatus status,
        Long shelterId, String shelterName, LocalDateTime createdAt
) {
    public static PetResponse from(Pet pet) {
        return new PetResponse(
                pet.getId(), pet.getName(), pet.getSpecies(), pet.getBreed(), pet.getAge(),
                pet.getGender(), pet.getDescription(), pet.getImageUrl(), pet.getStatus(),
                pet.getShelter().getId(), pet.getShelter().getName(), pet.getCreatedAt()
        );
    }
}
