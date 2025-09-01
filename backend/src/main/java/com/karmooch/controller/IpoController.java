package com.karmooch.controller;

import com.karmooch.service.FinnhubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ipo")
@CrossOrigin(origins = "http://localhost:3000")
public class IpoController {
    
    @Autowired
    private FinnhubService finnhubService;
    
    /**
     * Get IPO calendar for a specific date range
     */
    @GetMapping("/calendar")
    public ResponseEntity<?> getIpoCalendar(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        
        try {
            List<FinnhubService.IpoOffering> ipoOfferings;
            
            if (from != null && to != null) {
                ipoOfferings = finnhubService.getIpoCalendar(from, to);
            } else {
                // Default to next 30 days if no date range specified
                ipoOfferings = finnhubService.getNext30DaysIpoCalendar();
            }
            
            return ResponseEntity.ok(Map.of(
                "ipoOfferings", ipoOfferings,
                "count", ipoOfferings.size(),
                "source", "Finnhub API"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to fetch IPO calendar: " + e.getMessage()));
        }
    }
    
    /**
     * Get IPO calendar for the current month
     */
    @GetMapping("/calendar/current-month")
    public ResponseEntity<?> getCurrentMonthIpoCalendar() {
        try {
            List<FinnhubService.IpoOffering> ipoOfferings = finnhubService.getCurrentMonthIpoCalendar();
            
            return ResponseEntity.ok(Map.of(
                "ipoOfferings", ipoOfferings,
                "count", ipoOfferings.size(),
                "period", "Current Month",
                "source", "Finnhub API"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to fetch current month IPO calendar: " + e.getMessage()));
        }
    }
    
    /**
     * Get IPO calendar for the next 30 days
     */
    @GetMapping("/calendar/next-30-days")
    public ResponseEntity<?> getNext30DaysIpoCalendar() {
        try {
            List<FinnhubService.IpoOffering> ipoOfferings = finnhubService.getNext30DaysIpoCalendar();
            
            return ResponseEntity.ok(Map.of(
                "ipoOfferings", ipoOfferings,
                "count", ipoOfferings.size(),
                "period", "Next 30 Days",
                "source", "Finnhub API"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to fetch next 30 days IPO calendar: " + e.getMessage()));
        }
    }
}
