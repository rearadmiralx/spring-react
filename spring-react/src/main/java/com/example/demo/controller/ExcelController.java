package com.example.demo.controller;

import com.example.demo.service.impl.ExcelReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "*")
@RestController
public class ExcelController {

    @Autowired
    private ExcelReader fileService;

    @PostMapping("/convert")
    public ResponseEntity<String> convertFile(@RequestParam("file") MultipartFile file) {
        try {
            String excelFilePath = fileService.convertCsvToExcel(file);
            return ResponseEntity.ok(excelFilePath);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<FileSystemResource> downloadFile(@RequestParam String excelFilePath) {
        File file = new File(excelFilePath);

        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + file.getName());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new FileSystemResource(file));
    }
}