package com.karmooch.dto;

import com.karmooch.entity.Investment;
import java.math.BigDecimal;
import java.time.LocalDate;

public class InvestmentSummaryDto {
    
    private Long id;
    private String symbol;
    private String name;
    private BigDecimal shares;
    private BigDecimal purchasePrice;
    private LocalDate purchaseDate;
    private BigDecimal currentValue;
    private BigDecimal totalCost;
    private BigDecimal gainLoss;
    private BigDecimal gainLossPercentage;
    
    // Constructors
    public InvestmentSummaryDto() {}
    
    public InvestmentSummaryDto(Long id, String symbol, String name, BigDecimal shares, 
                              BigDecimal purchasePrice, LocalDate purchaseDate,
                              BigDecimal currentValue, BigDecimal totalCost, 
                              BigDecimal gainLoss, BigDecimal gainLossPercentage) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.shares = shares;
        this.purchasePrice = purchasePrice;
        this.purchaseDate = purchaseDate;
        this.currentValue = currentValue;
        this.totalCost = totalCost;
        this.gainLoss = gainLoss;
        this.gainLossPercentage = gainLossPercentage;
    }
    
    // Static factory method to create from Investment entity
    public static InvestmentSummaryDto fromInvestment(Investment investment) {
        BigDecimal totalCost = investment.getShares().multiply(investment.getPurchasePrice());
        
        // This will be set by the service layer with real current market price
        BigDecimal currentValue = BigDecimal.ZERO;
        BigDecimal gainLoss = BigDecimal.ZERO;
        BigDecimal gainLossPercentage = BigDecimal.ZERO;
        
        return new InvestmentSummaryDto(
            investment.getId(),
            investment.getSymbol(),
            investment.getName(),
            investment.getShares(),
            investment.getPurchasePrice(),
            investment.getPurchaseDate(),
            currentValue,
            totalCost,
            gainLoss,
            gainLossPercentage
        );
    }
    
    // Static factory method with current market price
    public static InvestmentSummaryDto fromInvestmentWithCurrentPrice(Investment investment, BigDecimal currentMarketPrice) {
        BigDecimal totalCost = investment.getShares().multiply(investment.getPurchasePrice());
        BigDecimal currentValue = investment.getShares().multiply(currentMarketPrice);
        
        BigDecimal gainLoss = currentValue.subtract(totalCost);
        BigDecimal gainLossPercentage = totalCost.compareTo(BigDecimal.ZERO) > 0 
            ? gainLoss.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;
        
        return new InvestmentSummaryDto(
            investment.getId(),
            investment.getSymbol(),
            investment.getName(),
            investment.getShares(),
            investment.getPurchasePrice(),
            investment.getPurchaseDate(),
            currentValue,
            totalCost,
            gainLoss,
            gainLossPercentage
        );
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public BigDecimal getShares() {
        return shares;
    }
    
    public void setShares(BigDecimal shares) {
        this.shares = shares;
    }
    
    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }
    
    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }
    
    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }
    
    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    
    public BigDecimal getCurrentValue() {
        return currentValue;
    }
    
    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }
    
    public BigDecimal getTotalCost() {
        return totalCost;
    }
    
    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }
    
    public BigDecimal getGainLoss() {
        return gainLoss;
    }
    
    public void setGainLoss(BigDecimal gainLoss) {
        this.gainLoss = gainLoss;
    }
    
    public BigDecimal getGainLossPercentage() {
        return gainLossPercentage;
    }
    
    public void setGainLossPercentage(BigDecimal gainLossPercentage) {
        this.gainLossPercentage = gainLossPercentage;
    }
}
