package com.smartretail.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalShelves", 4);
        summary.put("inStockShelves", 2);
        summary.put("lowStockShelves", 2);
        summary.put("queueLength", 3);
        summary.put("systemStatus", "ONLINE");
        summary.put("edgeAiSync", true);
        return ResponseEntity.ok(summary);
    }
}
