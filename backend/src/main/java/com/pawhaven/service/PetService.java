package com.pawhaven.service;

import com.pawhaven.dto.PetRequest;
import com.pawhaven.dto.PetResponse;
import com.pawhaven.exception.ResourceNotFoundException;
import com.pawhaven.model.*;
import com.pawhaven.repository.PetRepository;
import com.pawhaven.repository.UserRepository;
import java.util.Map;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PetService {
    private final PetRepository pets;
    private final UserRepository users;

    public PetService(PetRepository pets, UserRepository users) {
        this.pets = pets;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public Page<PetResponse> list(int page, int size, String sortBy, String direction) {
        if (!Map.of("name", true, "age", true, "createdAt", true, "species", true, "status", true).containsKey(sortBy)) {
            throw new IllegalArgumentException("sortBy must be one of: name, age, createdAt, species, status.");
        }
        int safeSize = Math.max(1, Math.min(size, 50));
        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return pets.findAll(PageRequest.of(Math.max(page, 0), safeSize, sort)).map(PetResponse::from);
    }

    @Transactional(readOnly = true)
    public PetResponse get(Long id) {
        return PetResponse.from(findPet(id));
    }

    @Transactional
    public PetResponse create(PetRequest request, String email) {
        Pet pet = new Pet();
        apply(pet, request);
        AppUser shelter = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found."));
        pet.setShelter(shelter);
        if (pet.getStatus() == null) pet.setStatus(PetStatus.AVAILABLE);
        return PetResponse.from(pets.save(pet));
    }

    @Transactional
    public PetResponse update(Long id, PetRequest request, String email, boolean admin) {
        Pet pet = findPet(id);
        if (!admin && !pet.getShelter().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException("You can only manage pets added by your shelter.");
        }
        apply(pet, request);
        return PetResponse.from(pets.save(pet));
    }

    @Transactional
    public void delete(Long id, String email, boolean admin) {
        Pet pet = findPet(id);
        if (!admin && !pet.getShelter().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException("You can only delete pets added by your shelter.");
        }
        pets.delete(pet);
    }

    private Pet findPet(Long id) {
        return pets.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pet not found: " + id));
    }

    private void apply(Pet pet, PetRequest request) {
        pet.setName(request.name().trim());
        pet.setSpecies(request.species().trim());
        pet.setBreed(request.breed());
        pet.setAge(request.age());
        pet.setGender(request.gender().trim());
        pet.setDescription(request.description());
        pet.setImageUrl(request.imageUrl());
        if (request.status() != null) pet.setStatus(request.status());
    }
}
