package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/data")
    public ResponseEntity<Map<String, String>> getData() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from the backend!");
        return ResponseEntity.ok(response);
    }
}