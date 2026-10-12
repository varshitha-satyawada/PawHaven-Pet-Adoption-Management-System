package com.pawhaven.controller;

import com.pawhaven.dto.*;
import com.pawhaven.service.AdoptionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adoptions")
public class AdoptionController {
    private final AdoptionService adoptionService;

    public AdoptionController(AdoptionService adoptionService) { this.adoptionService = adoptionService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADOPTER')")
    public AdoptionResponse create(@Valid @RequestBody AdoptionRequestCreate input, Authentication auth) {
        return adoptionService.create(input, auth.getName());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ADOPTER')")
    public List<AdoptionResponse> myRequests(Authentication auth) {
        return adoptionService.myRequests(auth.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    public List<AdoptionResponse> allRequests(Authentication auth) {
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return adoptionService.allRequests(auth.getName(), admin);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    public AdoptionResponse updateStatus(@PathVariable Long id,
                                         @Valid @RequestBody AdoptionStatusUpdate input,
                                         Authentication auth) {
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return adoptionService.updateStatus(id, input.status(), auth.getName(), admin);
    }
}
