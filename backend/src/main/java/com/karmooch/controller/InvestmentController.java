package com.karmooch.controller;

import com.karmooch.dto.*;
import com.karmooch.entity.Investment;
import com.karmooch.entity.Portfolio;
import com.karmooch.service.InvestmentService;
import com.karmooch.service.PortfolioService;
import com.karmooch.service.UserService;
import com.karmooch.service.MarketDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolios/{portfolioId}/investments")
@CrossOrigin(origins = "http://localhost:3000")
public class InvestmentController {
    
    @Autowired
    private InvestmentService investmentService;
    
    @Autowired
    private PortfolioService portfolioService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private MarketDataService marketDataService;
    
    @GetMapping
    public ResponseEntity<?> getPortfolioInvestments(@RequestHeader("Authorization") String token,
                                                   @PathVariable Long portfolioId) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(portfolioId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            List<Investment> investments = investmentService.getInvestmentsByPortfolio(portfolioId);
            List<InvestmentDto> investmentDtos = investments.stream()
                .map(investment -> {
                    BigDecimal currentPrice = marketDataService.getCurrentPrice(investment.getSymbol());
                    return InvestmentDto.fromInvestmentWithCurrentPrice(investment, currentPrice);
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(investmentDtos);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createInvestment(@RequestHeader("Authorization") String token,
                                            @PathVariable Long portfolioId,
                                            @Valid @RequestBody CreateInvestmentRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(portfolioId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            Optional<Portfolio> portfolioOptional = portfolioService.getPortfolioById(portfolioId);
            if (portfolioOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Portfolio portfolio = portfolioOptional.get();
            Investment investment = investmentService.createInvestment(
                portfolio,
                request.getSymbol(),
                request.getName(),
                request.getShares(),
                request.getPurchasePrice(),
                request.getPurchaseDate()
            );
            
            InvestmentDto investmentDto = InvestmentDto.fromInvestment(investment);
            return ResponseEntity.status(HttpStatus.CREATED).body(investmentDto);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @GetMapping("/{investmentId}")
    public ResponseEntity<?> getInvestment(@RequestHeader("Authorization") String token,
                                         @PathVariable Long portfolioId,
                                         @PathVariable Long investmentId) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(portfolioId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            Optional<Investment> investmentOptional = investmentService.getInvestmentById(investmentId);
            
            if (investmentOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify the investment belongs to the specified portfolio
            Investment investment = investmentOptional.get();
            if (!investment.getPortfolio().getId().equals(portfolioId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Investment does not belong to this portfolio"));
            }
            
            InvestmentDto investmentDto = InvestmentDto.fromInvestment(investment);
            return ResponseEntity.ok(investmentDto);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @PutMapping("/{investmentId}")
    public ResponseEntity<?> updateInvestment(@RequestHeader("Authorization") String token,
                                            @PathVariable Long portfolioId,
                                            @PathVariable Long investmentId,
                                            @Valid @RequestBody CreateInvestmentRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(portfolioId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            Optional<Investment> investmentOptional = investmentService.getInvestmentById(investmentId);
            
            if (investmentOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify the investment belongs to the specified portfolio
            Investment investment = investmentOptional.get();
            if (!investment.getPortfolio().getId().equals(portfolioId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Investment does not belong to this portfolio"));
            }
            
            Investment updatedInvestment = investmentService.updateInvestment(
                investmentId,
                request.getSymbol(),
                request.getName(),
                request.getShares(),
                request.getPurchasePrice(),
                request.getPurchaseDate()
            );
            
            InvestmentDto investmentDto = InvestmentDto.fromInvestment(updatedInvestment);
            return ResponseEntity.ok(investmentDto);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid token"));
        }
    }
    
    @DeleteMapping("/{investmentId}")
    public ResponseEntity<?> deleteInvestment(@RequestHeader("Authorization") String token,
                                            @PathVariable Long portfolioId,
                                            @PathVariable Long investmentId) {
        try {
            Long userId = extractUserIdFromToken(token);
            
            if (!portfolioService.isPortfolioOwnedByUser(portfolioId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
            }
            
            Optional<Investment> investmentOptional = investmentService.getInvestmentById(investmentId);
            
            if (investmentOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify the investment belongs to the specified portfolio
            Investment investment = investmentOptional.get();
            if (!investment.getPortfolio().getId().equals(portfolioId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Investment does not belong to this portfolio"));
            }
            
            investmentService.deleteInvestment(investmentId);
            return ResponseEntity.ok(Map.of("message", "Investment deleted successfully"));
            
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
