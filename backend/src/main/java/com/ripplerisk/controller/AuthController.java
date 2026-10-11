package com.ripplerisk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Placeholder auth controller.
 * Replace with proper JWT issuance (e.g. jjwt) when integrating full auth.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        // Demo: accept admin@ripplerisk.com / password
        if ("admin@ripplerisk.com".equals(email) && "password".equals(password)) {
            return ResponseEntity.ok(Map.of("token", "demo-jwt-token-replace-with-real-jwt"));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
