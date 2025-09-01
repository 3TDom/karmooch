package com.karmooch.dto;

import com.karmooch.entity.Portfolio;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PortfolioSummaryDto {
    
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int investmentCount;
    private BigDecimal totalValue;
    private BigDecimal totalCost;
    private BigDecimal totalGainLoss;
    private BigDecimal totalGainLossPercentage;
    private List<InvestmentSummaryDto> topInvestments;
    
    // Constructors
    public PortfolioSummaryDto() {}
    
    public PortfolioSummaryDto(Long id, String name, String description, LocalDateTime createdAt, 
                             LocalDateTime updatedAt, int investmentCount, BigDecimal totalValue,
                             BigDecimal totalCost, BigDecimal totalGainLoss, BigDecimal totalGainLossPercentage) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.investmentCount = investmentCount;
        this.totalValue = totalValue;
        this.totalCost = totalCost;
        this.totalGainLoss = totalGainLoss;
        this.totalGainLossPercentage = totalGainLossPercentage;
    }
    
    // Static factory method to create from Portfolio entity
    public static PortfolioSummaryDto fromPortfolio(Portfolio portfolio) {
        // Calculate totals from investments
        int investmentCount = portfolio.getInvestments() != null ? portfolio.getInvestments().size() : 0;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalValue = BigDecimal.ZERO;
        
        if (portfolio.getInvestments() != null) {
            for (var investment : portfolio.getInvestments()) {
                BigDecimal cost = investment.getShares().multiply(investment.getPurchasePrice());
                totalCost = totalCost.add(cost);
                
                // This will be updated by the service layer with real current market prices
                BigDecimal currentValue = investment.getShares().multiply(investment.getPurchasePrice());
                totalValue = totalValue.add(currentValue);
            }
        }
        
        BigDecimal totalGainLoss = totalValue.subtract(totalCost);
        BigDecimal totalGainLossPercentage = totalCost.compareTo(BigDecimal.ZERO) > 0 
            ? totalGainLoss.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;
        
        return new PortfolioSummaryDto(
            portfolio.getId(),
            portfolio.getName(),
            portfolio.getDescription(),
            portfolio.getCreatedAt(),
            portfolio.getUpdatedAt(),
            investmentCount,
            totalValue,
            totalCost,
            totalGainLoss,
            totalGainLossPercentage
        );
    }
    
    // Static factory method with current market prices
    public static PortfolioSummaryDto fromPortfolioWithCurrentPrices(Portfolio portfolio, Map<String, BigDecimal> currentPrices) {
        int investmentCount = portfolio.getInvestments() != null ? portfolio.getInvestments().size() : 0;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalValue = BigDecimal.ZERO;
        
        if (portfolio.getInvestments() != null) {
            for (var investment : portfolio.getInvestments()) {
                BigDecimal cost = investment.getShares().multiply(investment.getPurchasePrice());
                totalCost = totalCost.add(cost);
                
                // Use current market price if available, otherwise use purchase price
                BigDecimal currentPrice = currentPrices.getOrDefault(investment.getSymbol(), investment.getPurchasePrice());
                BigDecimal currentValue = investment.getShares().multiply(currentPrice);
                totalValue = totalValue.add(currentValue);
            }
        }
        
        BigDecimal totalGainLoss = totalValue.subtract(totalCost);
        BigDecimal totalGainLossPercentage = totalCost.compareTo(BigDecimal.ZERO) > 0 
            ? totalGainLoss.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;
        
        return new PortfolioSummaryDto(
            portfolio.getId(),
            portfolio.getName(),
            portfolio.getDescription(),
            portfolio.getCreatedAt(),
            portfolio.getUpdatedAt(),
            investmentCount,
            totalValue,
            totalCost,
            totalGainLoss,
            totalGainLossPercentage
        );
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public int getInvestmentCount() {
        return investmentCount;
    }
    
    public void setInvestmentCount(int investmentCount) {
        this.investmentCount = investmentCount;
    }
    
    public BigDecimal getTotalValue() {
        return totalValue;
    }
    
    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }
    
    public BigDecimal getTotalCost() {
        return totalCost;
    }
    
    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }
    
    public BigDecimal getTotalGainLoss() {
        return totalGainLoss;
    }
    
    public void setTotalGainLoss(BigDecimal totalGainLoss) {
        this.totalGainLoss = totalGainLoss;
    }
    
    public BigDecimal getTotalGainLossPercentage() {
        return totalGainLossPercentage;
    }
    
    public void setTotalGainLossPercentage(BigDecimal totalGainLossPercentage) {
        this.totalGainLossPercentage = totalGainLossPercentage;
    }
    
    public List<InvestmentSummaryDto> getTopInvestments() {
        return topInvestments;
    }
    
    public void setTopInvestments(List<InvestmentSummaryDto> topInvestments) {
        this.topInvestments = topInvestments;
    }
}
