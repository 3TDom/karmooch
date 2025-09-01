package com.karmooch.service;

import com.karmooch.entity.Investment;
import com.karmooch.entity.Portfolio;
import com.karmooch.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InvestmentService {
    
    @Autowired
    private InvestmentRepository investmentRepository;
    
    public Investment createInvestment(Portfolio portfolio, String symbol, String name, 
                                     BigDecimal shares, BigDecimal purchasePrice, LocalDate purchaseDate) {
        Investment investment = new Investment(portfolio, symbol, name, shares, purchasePrice, purchaseDate);
        return investmentRepository.save(investment);
    }
    
    public List<Investment> getInvestmentsByPortfolio(Long portfolioId) {
        return investmentRepository.findByPortfolioIdOrderByCreatedAtDesc(portfolioId);
    }
    
    public Optional<Investment> getInvestmentById(Long id) {
        return investmentRepository.findById(id);
    }
    
    public Investment updateInvestment(Long id, String symbol, String name, 
                                     BigDecimal shares, BigDecimal purchasePrice, LocalDate purchaseDate) {
        Investment investment = investmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Investment not found"));
        
        investment.setSymbol(symbol);
        investment.setName(name);
        investment.setShares(shares);
        investment.setPurchasePrice(purchasePrice);
        investment.setPurchaseDate(purchaseDate);
        
        return investmentRepository.save(investment);
    }
    
    public void deleteInvestment(Long id) {
        investmentRepository.deleteById(id);
    }
    
    public List<Investment> getInvestmentsBySymbol(String symbol) {
        return investmentRepository.findBySymbol(symbol);
    }
}
