package com.org.lms.auth.client;

import com.org.lms.auth.dto.UserLookupResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class TrainerClient {

    private final RestTemplate restTemplate;

    public TrainerClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Optional<UserLookupResponse> findByEmail(String email) {
        try {
            UserLookupResponse response = restTemplate.getForObject(
                    "http://trainer-service/internal/trainers/by-email/{email}",
                    UserLookupResponse.class,
                    email
            );
            return Optional.ofNullable(response);
        } catch (HttpClientErrorException.NotFound ex) {
            return Optional.empty();
        }
    }
}
