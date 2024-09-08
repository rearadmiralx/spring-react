package com.example.demo.service.impl;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@Service
public class ExcelReader {
    public String convertCsvToExcel(MultipartFile file) throws IOException {
        String excelFilePath = "output.xlsx"; // Change this path as needed
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
             Workbook workbook = new XSSFWorkbook();
             FileOutputStream outputStream = new FileOutputStream(excelFilePath)) {

            Sheet sheet = workbook.createSheet("Data");
            String line;
            int rowNum = 0;

            // Read header
            if ((line = br.readLine()) != null) {
                String[] headers = line.split("\\|");
                Row headerRow = sheet.createRow(rowNum++);
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i].trim());
                }
            }

            // Read data
            while ((line = br.readLine()) != null) {
                String[] data = line.split("\\|");
                Row dataRow = sheet.createRow(rowNum++);
                for (int i = 0; i < data.length; i++) {
                    Cell cell = dataRow.createCell(i);
                    cell.setCellValue(data[i].trim());
                }
            }

            workbook.write(outputStream);
        }
        return excelFilePath;
    }

    public void convertCsvToExcel(String csvFilePath, String excelFilePath) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(csvFilePath));
             Workbook workbook = new XSSFWorkbook();
             FileOutputStream outputStream = new FileOutputStream(excelFilePath)) {

            Sheet sheet = workbook.createSheet("Data");
            String line;
            int rowNum = 0;

            // Read header
            if ((line = br.readLine()) != null) {
                String[] headers = line.split("\\|");
                Row headerRow = sheet.createRow(rowNum++);
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i].trim());
                }
            }

            // Read data
            while ((line = br.readLine()) != null) {
                String[] data = line.split("\\|");
                Row dataRow = sheet.createRow(rowNum++);
                for (int i = 0; i < data.length; i++) {
                    Cell cell = dataRow.createCell(i);
                    cell.setCellValue(data[i].trim());
                }
            }

            workbook.write(outputStream);
        }
    }
}