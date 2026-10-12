package com.pawhaven.repository;

import com.pawhaven.model.AdoptionRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByAdopterIdOrderByRequestedAtDesc(Long adopterId);
    List<AdoptionRequest> findAllByOrderByRequestedAtDesc();
    boolean existsByPetIdAndAdopterIdAndStatus(Long petId, Long adopterId, com.pawhaven.model.AdoptionStatus status);
}
