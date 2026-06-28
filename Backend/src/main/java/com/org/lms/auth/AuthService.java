package com.org.lms.auth;

import com.org.lms.auth.dto.*;
import com.org.lms.exception.ResourceNotFoundException;
import com.org.lms.exception.UnauthorizedException;
import com.org.lms.security.JwtTokenProvider;
import com.org.lms.user.entity.Coordinator;
import com.org.lms.user.entity.Student;
import com.org.lms.user.entity.Trainer;
import com.org.lms.user.entity.User;
import com.org.lms.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name());

        if (user instanceof Coordinator) {
            Coordinator coord = (Coordinator) user;
            builder.fullName(coord.getFullName())
                   .phoneNumber(coord.getPhoneNumber());
        } else if (user instanceof Trainer) {
            Trainer trainer = (Trainer) user;
            builder.firstName(trainer.getFirstName())
                   .lastName(trainer.getLastName())
                   .fullName(trainer.getFirstName() + " " + trainer.getLastName())
                   .employeeId(trainer.getEmployeeId())
                   .phoneNumber(trainer.getPhoneNumber());
        } else if (user instanceof Student) {
            Student student = (Student) user;
            builder.firstName(student.getFirstName())
                   .lastName(student.getLastName())
                   .fullName(student.getFirstName() + " " + student.getLastName())
                   .employeeId(student.getEmployeeId())
                   .phoneNumber(student.getPhoneNumber());
        }

        return builder.build();
    }

    @Transactional
    public void changePassword(String email, PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new UnauthorizedException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public AuthResponse refreshToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String newToken = tokenProvider.generateToken(email);

        return AuthResponse.builder()
                .token(newToken)
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
    }
}
