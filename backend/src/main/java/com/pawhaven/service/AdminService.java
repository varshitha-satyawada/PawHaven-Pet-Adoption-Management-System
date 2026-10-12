package com.pawhaven.service;

import com.pawhaven.model.Role;
import com.pawhaven.repository.UserRepository;
import com.pawhaven.repository.PetRepository;
import com.pawhaven.repository.AdoptionRequestRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AdoptionRequestRepository adoptionRepository;

    public AdminService(
            UserRepository userRepository,
            PetRepository petRepository,
            AdoptionRequestRepository adoptionRepository) {

        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.adoptionRepository = adoptionRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getDashboardStats() {

        long totalUsers = userRepository.count();

        long totalAdopters =
                userRepository.countByRole(Role.ADOPTER);

        long totalShelters =
                userRepository.countByRole(Role.SHELTER);

        long totalPets = petRepository.count();

        long totalAdoptionRequests =
                adoptionRepository.count();

        return Map.of(
                "totalUsers", totalUsers,
                "totalAdopters", totalAdopters,
                "totalShelters", totalShelters,
                "totalPets", totalPets,
                "totalAdoptionRequests", totalAdoptionRequests
        );
    }
}