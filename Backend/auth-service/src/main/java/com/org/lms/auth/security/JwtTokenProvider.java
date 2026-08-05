package com.org.lms.auth.security;

import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HexFormat;

/**
 * auth-service is the ONLY service that generates tokens. Every other service
 * carries a read-only copy of this class (minus generateToken) configured with
 * the SAME app.jwt.secret, purely to validate tokens locally.
 */
@Component
@Slf4j
public class JwtTokenProvider {

    private final SecretKey key;
    private final long jwtExpirationInMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-ms}") long jwtExpirationInMs) {

        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);

        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.jwtExpirationInMs = jwtExpirationInMs;

        log.info("Auth JWT Fingerprint : {}", fingerprint(keyBytes));
    }

    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        String token = Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();

        log.info("Generated token fingerprint: {}", tokenFingerprint(token));

        return token;
    }

    private String fingerprint(byte[] keyBytes) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(keyBytes);

            return HexFormat.of()
                    .formatHex(hash)
                    .substring(0, 12);
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }

    private String tokenFingerprint(String token) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            return HexFormat.of()
                    .formatHex(hash)
                    .substring(0, 12);

        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }
}
