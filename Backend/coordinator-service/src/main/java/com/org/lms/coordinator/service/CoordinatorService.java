package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.CoordinatorResponse;
import com.org.lms.coordinator.dto.CoordinatorSignupRequest;
import com.org.lms.coordinator.dto.UserLookupResponse;
import com.org.lms.coordinator.entity.Coordinator;
import com.org.lms.coordinator.repository.CoordinatorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CoordinatorService {

    private final CoordinatorRepository coordinatorRepository;
    private final PasswordEncoder passwordEncoder;

    public CoordinatorService(CoordinatorRepository coordinatorRepository, PasswordEncoder passwordEncoder) {
        this.coordinatorRepository = coordinatorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CoordinatorResponse registerCoordinator(CoordinatorSignupRequest request) {
        if (coordinatorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Coordinator coordinator = new Coordinator();
        coordinator.setFullName(request.getFullName());
        coordinator.setEmail(request.getEmail());
        coordinator.setPhoneNumber(request.getPhoneNumber());
        coordinator.setPassword(passwordEncoder.encode(request.getPassword()));
        coordinator.setStatus(Coordinator.Status.ACTIVE);

        Coordinator saved = coordinatorRepository.save(coordinator);

        return new CoordinatorResponse(saved.getCoordinatorId(), saved.getFullName(),
                saved.getEmail(), saved.getStatus().toString());
    }

    public Optional<UserLookupResponse> findByEmailForAuth(String email) {
        return coordinatorRepository.findByEmail(email)
                .map(c -> new UserLookupResponse(c.getEmail(), c.getPassword(), c.getRole().toString()));
    }
}
