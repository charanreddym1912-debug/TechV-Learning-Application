package com.org.lms.coordinator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class CoordinatorServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoordinatorServiceApplication.class, args);
    }
}
