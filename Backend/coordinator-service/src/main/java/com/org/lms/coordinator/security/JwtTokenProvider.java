package com.org.lms.coordinator.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.MessageDigest;
import java.util.HexFormat;


@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    public JwtTokenProvider(@Value("${app.jwt.secret}") String jwtSecret) {

        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);

        this.key = Keys.hmacShaKeyFor(keyBytes);

        log.info("Coordinator JWT Fingerprint : {}", fingerprint(keyBytes));
    }

    public String getUsernameFromJWT(String token) {
        return getClaims(token).getSubject();
    }

    public String getRoleFromJWT(String token) {
        return getClaims(token).get("role", String.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(authToken);

            return true;

        } catch (io.jsonwebtoken.security.SignatureException ex) {
            log.error("JWT signature validation failed");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }

        return false;
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
}
