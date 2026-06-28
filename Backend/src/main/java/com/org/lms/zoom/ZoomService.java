package com.org.lms.zoom;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomService {

    private final String clientId;
    private final String clientSecret;

    public ZoomService(
            @Value("${app.zoom.client-id}") String clientId,
            @Value("${app.zoom.client-secret}") String clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public Map<String, Object> generateZoomSignature(String meetingNumber, Integer role) {
        long iat = System.currentTimeMillis() / 1000 - 30; // 30 seconds buffer for clock drift
        long exp = iat + 7200; // 2 hours expiration

        SecretKey secretKey = Keys.hmacShaKeyFor(clientSecret.getBytes(StandardCharsets.UTF_8));

        String signature = Jwts.builder()
                .claim("sdkKey", clientId)
                .claim("mn", meetingNumber)
                .claim("role", role)
                .claim("iat", iat)
                .claim("exp", exp)
                .claim("tokenExp", exp)
                .signWith(secretKey)
                .compact();

        Map<String, Object> result = new HashMap<>();
        result.put("signature", signature);
        result.put("sdkKey", clientId);
        result.put("meetingNumber", meetingNumber);
        result.put("role", role);
        result.put("iat", iat);
        result.put("exp", exp);
        return result;
    }
}
