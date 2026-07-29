package com.org.lms.auth;

import com.org.lms.auth.client.CoordinatorClient;
import com.org.lms.auth.client.StudentClient;
import com.org.lms.auth.client.TrainerClient;
import com.org.lms.auth.dto.AuthResponse;
import com.org.lms.auth.dto.LoginRequest;
import com.org.lms.auth.dto.UserLookupResponse;
import com.org.lms.auth.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final StudentClient studentClient;
    private final TrainerClient trainerClient;
    private final CoordinatorClient coordinatorClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(StudentClient studentClient,
                        TrainerClient trainerClient,
                        CoordinatorClient coordinatorClient,
                        PasswordEncoder passwordEncoder,
                        JwtTokenProvider jwtTokenProvider) {
        this.studentClient = studentClient;
        this.trainerClient = trainerClient;
        this.coordinatorClient = coordinatorClient;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(LoginRequest request) {

        // Same lookup-chain idea as the monolith version, except each "repository"
        // call is now a REST call to a different microservice.
        Optional<UserLookupResponse> studentOpt = studentClient.findByEmail(request.getEmail());
        if (studentOpt.isPresent()) {
            return buildResponse(request, studentOpt.get());
        }

        Optional<UserLookupResponse> trainerOpt = trainerClient.findByEmail(request.getEmail());
        if (trainerOpt.isPresent()) {
            return buildResponse(request, trainerOpt.get());
        }

        Optional<UserLookupResponse> coordinatorOpt = coordinatorClient.findByEmail(request.getEmail());
        if (coordinatorOpt.isPresent()) {
            return buildResponse(request, coordinatorOpt.get());
        }

        throw new RuntimeException("Invalid email or password");
    }

    private AuthResponse buildResponse(LoginRequest request, UserLookupResponse user) {
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }
}
