package com.org.lms.trainer.controller;

import com.org.lms.trainer.dto.TrainerResponse;
import com.org.lms.trainer.dto.TrainerSignupRequest;
import com.org.lms.trainer.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/trainers")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @PostMapping("/registertrainer")
    public ResponseEntity<TrainerResponse> registerTrainer(@Valid @RequestBody TrainerSignupRequest request) {
        TrainerResponse response = trainerService.registerTrainer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
