package com.karmooch.controller;

import com.karmooch.dto.*;
import com.karmooch.entity.Portfolio;
import com.karmooch.entity.User;
import com.karmooch.service.PortfolioService;
import com.karmooch.service.UserService;
import com.karmooch.service.MarketDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "http://localhost:3000")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private MarketDataService marketDataService;
    
    @GetMapping
    public ResponseEntity<?> getUserPortfolios(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            List<Portfolio> portfolios = portfolioService.getPortfoliosByUser(userId);
            
            List<PortfolioDto> portfolioDtos = portfolios.stream()
                .map(PortfolioDto::fromPortfolioSummary)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(portfolioDtos);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<?> getUserPortfolioSummaries(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            List<Portfolio> portfolios = portfolioService.getPortfoliosByUser(userId);
            
            // Collect all unique symbols from all portfolios
            Map<String, BigDecimal> currentPrices = new HashMap<>();
            portfolios.stream()
                .flatMap(portfolio -> portfolio.getInvestments().stream())
                .map(investment -> investment.getSymbol())
                .distinct()
                .forEach(symbol -> currentPrices.put(symbol, marketDataService.getCurrentPrice(symbol)));
            
            List<PortfolioSummaryDto> portfolioSummaries = portfolios.stream()
                .map(portfolio -> PortfolioSummaryDto.fromPortfolioWithCurrentPrices(portfolio, currentPrices))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(portfolioSummaries);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createPortfolio(@RequestHeader("Authorization") String token,
                                           @Valid @RequestBody CreatePortfolioRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found"));
            }
            
            User user = userOptional.get();
            Portfolio portfolio = portfolioService.createPortfolio(
                user, 
                request.getName(), 
                request.getDescription()
            );
            
            PortfolioDto portfolioDto = PortfolioDto.fromPortfolioSummary(portfolio);
            return ResponseEntity.status(HttpStatus.CREATED).body(portfolioDto);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPortfolio(@RequestHeader("Authorization") String token,
                                        @PathVariable Long id) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(id, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            Optional<Portfolio> portfolioOptional = portfolioService.getPortfolioById(id);
            
            if (portfolioOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            PortfolioDto portfolioDto = PortfolioDto.fromPortfolio(portfolioOptional.get());
            return ResponseEntity.ok(portfolioDto);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePortfolio(@RequestHeader("Authorization") String token,
                                           @PathVariable Long id,
                                           @Valid @RequestBody CreatePortfolioRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(id, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            Portfolio portfolio = portfolioService.updatePortfolio(
                id, 
                request.getName(), 
                request.getDescription()
            );
            
            PortfolioDto portfolioDto = PortfolioDto.fromPortfolioSummary(portfolio);
            return ResponseEntity.ok(portfolioDto);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePortfolio(@RequestHeader("Authorization") String token,
                                           @PathVariable Long id) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(id, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            portfolioService.deletePortfolio(id);
            return ResponseEntity.ok(Map.of("message", "Portfolio deleted successfully"));
            
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
