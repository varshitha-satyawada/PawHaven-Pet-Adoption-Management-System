package com.pawhaven.service;

import com.pawhaven.dto.*;
import com.pawhaven.model.AppUser;
import com.pawhaven.model.Role;
import com.pawhaven.repository.UserRepository;
import com.pawhaven.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) throw new IllegalArgumentException("Email is already registered.");
        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.ADOPTER); // Never accept a role from public registration.
        users.save(user);
        return tokenResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));
        AppUser user = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        return tokenResponse(user);
    }

    private AuthResponse tokenResponse(AppUser user) {
        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()),
                user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
