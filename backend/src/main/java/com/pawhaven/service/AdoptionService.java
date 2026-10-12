package com.pawhaven.service;

import com.pawhaven.dto.*;
import com.pawhaven.exception.ResourceNotFoundException;
import com.pawhaven.model.*;
import com.pawhaven.repository.AdoptionRequestRepository;
import com.pawhaven.repository.PetRepository;
import com.pawhaven.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdoptionService {
    private final AdoptionRequestRepository requests;
    private final PetRepository pets;
    private final UserRepository users;

    public AdoptionService(AdoptionRequestRepository requests, PetRepository pets, UserRepository users) {
        this.requests = requests;
        this.pets = pets;
        this.users = users;
    }

    @Transactional
    public AdoptionResponse create(AdoptionRequestCreate input, String email) {
        AppUser adopter = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found."));
        Pet pet = pets.findById(input.petId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found: " + input.petId()));
        if (pet.getStatus() != PetStatus.AVAILABLE) {
            throw new IllegalArgumentException("This pet is not currently available for adoption.");
        }
        if (requests.existsByPetIdAndAdopterIdAndStatus(pet.getId(), adopter.getId(), AdoptionStatus.PENDING)) {
            throw new IllegalArgumentException("You already have a pending request for this pet.");
        }
        AdoptionRequest request = new AdoptionRequest();
        request.setPet(pet);
        request.setAdopter(adopter);
        request.setMessage(input.message());
        request.setStatus(AdoptionStatus.PENDING);
        return AdoptionResponse.from(requests.save(request));
    }

    @Transactional(readOnly = true)
    public List<AdoptionResponse> myRequests(String email) {
        AppUser adopter = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found."));
        return requests.findByAdopterIdOrderByRequestedAtDesc(adopter.getId())
                .stream().map(AdoptionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<AdoptionResponse> allRequests(String email, boolean admin) {
        return requests.findAllByOrderByRequestedAtDesc().stream()
                .filter(request -> admin || request.getPet().getShelter().getEmail().equals(email))
                .map(AdoptionResponse::from).toList();
    }

    @Transactional
    public AdoptionResponse updateStatus(Long id, AdoptionStatus status, String email, boolean admin) {
        AdoptionRequest request = requests.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adoption request not found: " + id));
        if (!admin && !request.getPet().getShelter().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException("You can only review requests for your shelter's pets.");
        }
        if (request.getStatus() != AdoptionStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be reviewed.");
        }
        request.setStatus(status);
        if (status == AdoptionStatus.APPROVED) {
            request.getPet().setStatus(PetStatus.ADOPTED);
        }
        return AdoptionResponse.from(requests.save(request));
    }
}
