package com.pawhaven.repository;

import com.pawhaven.model.AppUser;
import com.pawhaven.model.Role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);
}