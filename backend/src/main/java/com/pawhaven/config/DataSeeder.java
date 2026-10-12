package com.pawhaven.config;

import com.pawhaven.model.*;
import com.pawhaven.repository.PetRepository;
import com.pawhaven.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedPets(UserRepository users, PetRepository pets, PasswordEncoder encoder) {
        return args -> {
            AppUser demoShelter = users.findByEmail("demo-shelter@pawhaven.local").orElseGet(() -> {
                AppUser user = new AppUser();
                user.setName("PawHaven Demo Shelter");
                user.setEmail("demo-shelter@pawhaven.local");
                user.setPassword(encoder.encode("DemoPassword123!"));
                user.setRole(Role.SHELTER);
                return users.save(user);
            });
            if (pets.count() == 0) {
                addPet(pets, demoShelter, "Milo", "Dog", "Indie", 2, "Male",
                        "A playful, friendly dog who loves walks and people.", "");
                addPet(pets, demoShelter, "Luna", "Cat", "Domestic Shorthair", 1, "Female",
                        "A curious kitten who enjoys sunny windows and gentle cuddles.", "");
                addPet(pets, demoShelter, "Coco", "Rabbit", "Mini Lop", 3, "Female",
                        "A calm rabbit looking for a quiet, caring home.", "");
                addPet(pets, demoShelter, "Bruno", "Dog", "Labrador Mix", 4, "Male",
                        "Loyal and energetic. Best suited to an active family.", "");
                addPet(pets, demoShelter, "Pepper", "Cat", "Tuxedo", 2, "Female",
                        "Independent, affectionate, and ready for her forever home.", "");
                addPet(pets, demoShelter, "Sunny", "Bird", "Parakeet", 1, "Male",
                        "A bright little companion with a cheerful personality.", "");
            }
        };
    }

    private void addPet(PetRepository pets, AppUser shelter, String name, String species,
                        String breed, int age, String gender, String description, String imageUrl) {
        Pet pet = new Pet();
        pet.setName(name);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setGender(gender);
        pet.setDescription(description);
        pet.setImageUrl(imageUrl);
        pet.setStatus(PetStatus.AVAILABLE);
        pet.setShelter(shelter);
        pets.save(pet);
    }
}
