package com.karmooch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinnhubService {
    
    private static final String FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
    private static final String IPO_CALENDAR_ENDPOINT = "/calendar/ipo";
    
    @Value("${finnhub.api.key:d2qlms9r01qn21mk39i0d2qlms9r01qn21mk39ig}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public FinnhubService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Get IPO calendar for a specific date range
     * @param from Start date (YYYY-MM-DD format)
     * @param to End date (YYYY-MM-DD format)
     * @return List of IPO offerings
     */
    public List<IpoOffering> getIpoCalendar(String from, String to) {
        try {
            String url = String.format("%s%s?from=%s&to=%s&token=%s", 
                FINNHUB_BASE_URL, IPO_CALENDAR_ENDPOINT, from, to, apiKey);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode rootNode = objectMapper.readTree(response);
            
            List<IpoOffering> ipoOfferings = new ArrayList<>();
            
            if (rootNode.has("ipoCalendar")) {
                JsonNode ipoCalendarNode = rootNode.get("ipoCalendar");
                
                for (JsonNode ipoNode : ipoCalendarNode) {
                    IpoOffering offering = new IpoOffering();
                    
                    if (ipoNode.has("date")) {
                        offering.setDate(ipoNode.get("date").asText());
                    }
                    if (ipoNode.has("company")) {
                        offering.setCompany(ipoNode.get("company").asText());
                    }
                    if (ipoNode.has("symbol")) {
                        offering.setSymbol(ipoNode.get("symbol").asText());
                    }
                    if (ipoNode.has("exchange")) {
                        offering.setExchange(ipoNode.get("exchange").asText());
                    }
                    if (ipoNode.has("action")) {
                        offering.setAction(ipoNode.get("action").asText());
                    }
                    if (ipoNode.has("shares")) {
                        offering.setShares(ipoNode.get("shares").asLong());
                    }
                    if (ipoNode.has("price")) {
                        offering.setPrice(ipoNode.get("price").asText());
                    }
                    if (ipoNode.has("currency")) {
                        offering.setCurrency(ipoNode.get("currency").asText());
                    }
                    
                    ipoOfferings.add(offering);
                }
            }
            
            return ipoOfferings;
            
        } catch (Exception e) {
            System.err.println("Error fetching IPO calendar: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Get IPO calendar for the current month
     */
    public List<IpoOffering> getCurrentMonthIpoCalendar() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return getIpoCalendar(startOfMonth.format(formatter), endOfMonth.format(formatter));
    }
    
    /**
     * Get IPO calendar for the next 30 days
     */
    public List<IpoOffering> getNext30DaysIpoCalendar() {
        LocalDate now = LocalDate.now();
        LocalDate thirtyDaysFromNow = now.plusDays(30);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return getIpoCalendar(now.format(formatter), thirtyDaysFromNow.format(formatter));
    }
    
    /**
     * IPO Offering data class
     */
    public static class IpoOffering {
        private String date;
        private String company;
        private String symbol;
        private String exchange;
        private String action;
        private Long shares;
        private String price;
        private String currency;
        
        // Constructors
        public IpoOffering() {}
        
        // Getters and Setters
        public String getDate() {
            return date;
        }
        
        public void setDate(String date) {
            this.date = date;
        }
        
        public String getCompany() {
            return company;
        }
        
        public void setCompany(String company) {
            this.company = company;
        }
        
        public String getSymbol() {
            return symbol;
        }
        
        public void setSymbol(String symbol) {
            this.symbol = symbol;
        }
        
        public String getExchange() {
            return exchange;
        }
        
        public void setExchange(String exchange) {
            this.exchange = exchange;
        }
        
        public String getAction() {
            return action;
        }
        
        public void setAction(String action) {
            this.action = action;
        }
        
        public Long getShares() {
            return shares;
        }
        
        public void setShares(Long shares) {
            this.shares = shares;
        }
        
        public String getPrice() {
            return price;
        }
        
        public void setPrice(String price) {
            this.price = price;
        }
        
        public String getCurrency() {
            return currency;
        }
        
        public void setCurrency(String currency) {
            this.currency = currency;
        }
    }
}
