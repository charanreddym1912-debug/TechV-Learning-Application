package com.org.lms.trainer.service;

import com.org.lms.trainer.dto.TrainerResponse;
import com.org.lms.trainer.dto.TrainerSignupRequest;
import com.org.lms.trainer.dto.UserLookupResponse;
import com.org.lms.trainer.entity.Trainer;
import com.org.lms.trainer.repository.TrainerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TrainerService {

    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    public TrainerService(TrainerRepository trainerRepository, PasswordEncoder passwordEncoder) {
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public TrainerResponse registerTrainer(TrainerSignupRequest request) {
        if (trainerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Trainer trainer = new Trainer();
        trainer.setFirstName(request.getFirstName());
        trainer.setLastName(request.getLastName());
        trainer.setEmail(request.getEmail());
        trainer.setPhoneNumber(request.getPhoneNumber());
        trainer.setSpecialization(request.getSpecialization());
        trainer.setExperienceYears(request.getExperienceYears());
        trainer.setDesignation(request.getDesignation());
        trainer.setPassword(passwordEncoder.encode(request.getPassword()));
        trainer.setStatus(Trainer.Status.ACTIVE);

        Trainer saved = trainerRepository.save(trainer);

        return new TrainerResponse(saved.getTrainerId(), saved.getFirstName(), saved.getLastName(),
                saved.getEmail(), saved.getDesignation(), saved.getStatus().toString());
    }

    public Optional<UserLookupResponse> findByEmailForAuth(String email) {
        return trainerRepository.findByEmail(email)
                .map(t -> new UserLookupResponse(t.getEmail(), t.getPassword(), t.getRole().toString()));
    }
}
