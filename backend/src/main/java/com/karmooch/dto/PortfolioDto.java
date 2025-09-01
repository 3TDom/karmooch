package com.karmooch.dto;

import com.karmooch.entity.Portfolio;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PortfolioDto {
    
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<InvestmentDto> investments;
    
    // Constructors
    public PortfolioDto() {}
    
    public PortfolioDto(Long id, String name, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Static factory method to create from Portfolio entity
    public static PortfolioDto fromPortfolio(Portfolio portfolio) {
        PortfolioDto dto = new PortfolioDto(
            portfolio.getId(),
            portfolio.getName(),
            portfolio.getDescription(),
            portfolio.getCreatedAt(),
            portfolio.getUpdatedAt()
        );
        
        if (portfolio.getInvestments() != null) {
            dto.setInvestments(
                portfolio.getInvestments().stream()
                    .map(InvestmentDto::fromInvestment)
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
    
    // Static factory method without investments (for list views)
    public static PortfolioDto fromPortfolioSummary(Portfolio portfolio) {
        return new PortfolioDto(
            portfolio.getId(),
            portfolio.getName(),
            portfolio.getDescription(),
            portfolio.getCreatedAt(),
            portfolio.getUpdatedAt()
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
    
    public List<InvestmentDto> getInvestments() {
        return investments;
    }
    
    public void setInvestments(List<InvestmentDto> investments) {
        this.investments = investments;
    }
}
