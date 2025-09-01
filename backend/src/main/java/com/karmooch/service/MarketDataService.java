package com.karmooch.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class MarketDataService {
    
    // Mock current prices - in a real application, this would fetch from a market data API
    private final Map<String, BigDecimal> mockCurrentPrices;
    private final Random random = new Random();
    
    public MarketDataService() {
        mockCurrentPrices = new HashMap<>();
        initializeMockPrices();
    }
    
    private void initializeMockPrices() {
        // Initialize with some realistic mock prices
        mockCurrentPrices.put("AAPL", new BigDecimal("175.50"));
        mockCurrentPrices.put("GOOGL", new BigDecimal("2850.75"));
        mockCurrentPrices.put("MSFT", new BigDecimal("415.20"));
        mockCurrentPrices.put("TSLA", new BigDecimal("245.80"));
        mockCurrentPrices.put("AMZN", new BigDecimal("3150.40"));
        mockCurrentPrices.put("NVDA", new BigDecimal("485.60"));
        mockCurrentPrices.put("META", new BigDecimal("325.90"));
        mockCurrentPrices.put("NFLX", new BigDecimal("485.30"));
        mockCurrentPrices.put("AMD", new BigDecimal("125.40"));
        mockCurrentPrices.put("INTC", new BigDecimal("45.80"));
    }
    
    /**
     * Get current market price for a symbol
     * In a real application, this would fetch from a market data API like Alpha Vantage, Yahoo Finance, etc.
     */
    public BigDecimal getCurrentPrice(String symbol) {
        // Check if we have a cached price
        if (mockCurrentPrices.containsKey(symbol.toUpperCase())) {
            return mockCurrentPrices.get(symbol.toUpperCase());
        }
        
        // For unknown symbols, generate a mock price based on the symbol hash
        // This ensures consistent "prices" for the same symbol
        int hash = symbol.toUpperCase().hashCode();
        random.setSeed(hash);
        
        // Generate a price between $10 and $1000
        double basePrice = 10 + (random.nextDouble() * 990);
        BigDecimal mockPrice = new BigDecimal(basePrice).setScale(2, RoundingMode.HALF_UP);
        
        // Cache the generated price
        mockCurrentPrices.put(symbol.toUpperCase(), mockPrice);
        
        return mockPrice;
    }
    
    /**
     * Simulate price volatility by adding small random changes
     * This makes the demo more realistic
     */
    public BigDecimal getVolatilePrice(String symbol) {
        BigDecimal basePrice = getCurrentPrice(symbol);
        
        // Add small random variation (-5% to +5%)
        double variation = -0.05 + (random.nextDouble() * 0.10);
        BigDecimal multiplier = new BigDecimal(1 + variation).setScale(4, RoundingMode.HALF_UP);
        
        return basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Update mock prices with small random changes
     * In a real application, this would be triggered by market data updates
     */
    public void updateMockPrices() {
        for (String symbol : mockCurrentPrices.keySet()) {
            BigDecimal currentPrice = mockCurrentPrices.get(symbol);
            BigDecimal newPrice = getVolatilePrice(symbol);
            mockCurrentPrices.put(symbol, newPrice);
        }
    }
}
