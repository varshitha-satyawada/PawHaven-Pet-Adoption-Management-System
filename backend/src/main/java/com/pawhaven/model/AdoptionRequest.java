package com.pawhaven.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_requests")
public class AdoptionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "adopter_id", nullable = false)
    private AppUser adopter;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AdoptionStatus status = AdoptionStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    public AdoptionRequest() {}

    public Long getId() { return id; }
    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
    public AppUser getAdopter() { return adopter; }
    public void setAdopter(AppUser adopter) { this.adopter = adopter; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public AdoptionStatus getStatus() { return status; }
    public void setStatus(AdoptionStatus status) { this.status = status; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
}
