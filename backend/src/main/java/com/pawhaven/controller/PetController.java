package com.pawhaven.controller;

import com.pawhaven.dto.PetRequest;
import com.pawhaven.dto.PetResponse;
import com.pawhaven.service.PetService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) { this.petService = petService; }

    @GetMapping
    public Page<PetResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return petService.list(page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public PetResponse get(@PathVariable Long id) { return petService.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    public PetResponse create(@Valid @RequestBody PetRequest request, Authentication auth) {
        return petService.create(request, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    public PetResponse update(@PathVariable Long id, @Valid @RequestBody PetRequest request, Authentication auth) {
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return petService.update(id, request, auth.getName(), admin);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    public void delete(@PathVariable Long id, Authentication auth) {
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        petService.delete(id, auth.getName(), admin);
    }
}
