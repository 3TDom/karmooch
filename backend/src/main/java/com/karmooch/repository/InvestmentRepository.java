package com.karmooch.repository;

import com.karmooch.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    
    List<Investment> findByPortfolioId(Long portfolioId);
    
    List<Investment> findByPortfolioIdOrderByCreatedAtDesc(Long portfolioId);
    
    List<Investment> findBySymbol(String symbol);
}
