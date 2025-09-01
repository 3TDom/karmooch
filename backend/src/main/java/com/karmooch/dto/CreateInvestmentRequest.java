package com.karmooch.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateInvestmentRequest {
    
    @NotBlank(message = "Symbol is required")
    @Size(max = 20, message = "Symbol must not exceed 20 characters")
    private String symbol;
    
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @NotNull(message = "Shares is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Shares must be greater than 0")
    private BigDecimal shares;
    
    @NotNull(message = "Purchase price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Purchase price must be greater than 0")
    private BigDecimal purchasePrice;
    
    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;
    
    // Constructors
    public CreateInvestmentRequest() {}
    
    public CreateInvestmentRequest(String symbol, String name, BigDecimal shares, 
                                 BigDecimal purchasePrice, LocalDate purchaseDate) {
        this.symbol = symbol;
        this.name = name;
        this.shares = shares;
        this.purchasePrice = purchasePrice;
        this.purchaseDate = purchaseDate;
    }
    
    // Getters and Setters
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
}
