package com.org.lms.auth.client;

import com.org.lms.auth.dto.UserLookupResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class StudentClient {

    private final RestTemplate restTemplate;

    public StudentClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Optional<UserLookupResponse> findByEmail(String email) {
        try {
            // "student-service" is resolved via Eureka by the @LoadBalanced RestTemplate -
            // no hardcoded host:port needed.
            UserLookupResponse response = restTemplate.getForObject(
                    "http://student-service/internal/students/by-email/{email}",
                    UserLookupResponse.class,
                    email
            );
            return Optional.ofNullable(response);
        } catch (HttpClientErrorException.NotFound ex) {
            return Optional.empty();
        }
    }
}
