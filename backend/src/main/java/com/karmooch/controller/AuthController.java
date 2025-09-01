package com.karmooch.controller;

import com.karmooch.dto.*;
import com.karmooch.entity.User;
import com.karmooch.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName()
            );
            
            // For now, just return a simple token (user ID as string)
            String token = "simple-token-" + user.getId();
            UserDto userDto = UserDto.fromUser(user);
            
            return ResponseEntity.ok(new AuthResponse(token, userDto));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOptional = userService.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid email or password"));
        }
        
        User user = userOptional.get();
        
        if (!userService.validatePassword(user, request.getPassword())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid email or password"));
        }
        
        // For now, just return a simple token (user ID as string)
        String token = "simple-token-" + user.getId();
        UserDto userDto = UserDto.fromUser(user);
        
        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from simple token
            if (!token.startsWith("Bearer simple-token-")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
            }
            
            String userIdStr = token.substring("Bearer simple-token-".length());
            Long userId = Long.parseLong(userIdStr);
            
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found"));
            }
            
            UserDto userDto = UserDto.fromUser(userOptional.get());
            return ResponseEntity.ok(userDto);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid token"));
        }
    }
}