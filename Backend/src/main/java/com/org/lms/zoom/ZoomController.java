package com.org.lms.zoom;

import com.org.lms.auth.CustomUserDetails;
import com.org.lms.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zoom")
public class ZoomController {

    private final ZoomService zoomService;

    public ZoomController(ZoomService zoomService) {
        this.zoomService = zoomService;
    }

    @PostMapping("/signature")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateSignature(
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        
        String meetingNumber = payload.get("meetingNumber");
        if (meetingNumber == null || meetingNumber.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("meetingNumber is required"));
        }

        // Programmatically resolve Zoom SDK role: Host (1) for Trainer/Coordinator, Attendee (0) for Student
        int role = 0;
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            boolean isHost = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_TRAINER") || auth.getAuthority().equals("ROLE_COORDINATOR"));
            if (isHost) {
                role = 1;
            }
        }

        Map<String, Object> response = zoomService.generateZoomSignature(meetingNumber, role);
        return ResponseEntity.ok(ApiResponse.success("Zoom signature generated successfully", response));
    }
}
