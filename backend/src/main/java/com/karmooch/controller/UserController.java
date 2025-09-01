package com.karmooch.controller;

import com.karmooch.dto.*;
import com.karmooch.entity.User;
import com.karmooch.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            UserDto userDto = UserDto.fromUser(userOptional.get());
            return ResponseEntity.ok(userDto);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token,
                                         @Valid @RequestBody UpdateProfileRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            User updatedUser = userService.updateProfile(
                user, 
                request.getFirstName(), 
                request.getLastName(), 
                request.getEmail()
            );
            
            UserDto userDto = UserDto.fromUser(updatedUser);
            return ResponseEntity.ok(userDto);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token,
                                          @Valid @RequestBody ChangePasswordRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            userService.changePassword(user, request.getCurrentPassword(), request.getNewPassword());
            
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    private Long extractUserIdFromToken(String token) {
        if (!token.startsWith("Bearer simple-token-")) {
            throw new RuntimeException("Invalid token format");
        }
        
        String userIdStr = token.substring("Bearer simple-token-".length());
        return Long.parseLong(userIdStr);
    }
}
