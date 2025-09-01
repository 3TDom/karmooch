package com.karmooch.service;

import com.karmooch.entity.Portfolio;
import com.karmooch.entity.User;
import com.karmooch.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {
    
    @Autowired
    private PortfolioRepository portfolioRepository;
    
    public Portfolio createPortfolio(User user, String name, String description) {
        Portfolio portfolio = new Portfolio(user, name, description);
        return portfolioRepository.save(portfolio);
    }
    
    public List<Portfolio> getPortfoliosByUser(Long userId) {
        return portfolioRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Optional<Portfolio> getPortfolioById(Long id) {
        return portfolioRepository.findById(id);
    }
    
    public Portfolio updatePortfolio(Long id, String name, String description) {
        Portfolio portfolio = portfolioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        portfolio.setName(name);
        portfolio.setDescription(description);
        return portfolioRepository.save(portfolio);
    }
    
    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }
    
    public boolean isPortfolioOwnedByUser(Long portfolioId, Long userId) {
        Optional<Portfolio> portfolio = portfolioRepository.findById(portfolioId);
        return portfolio.isPresent() && portfolio.get().getUser().getId().equals(userId);
    }
}
