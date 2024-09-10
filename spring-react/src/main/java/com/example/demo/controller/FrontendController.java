package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = { "/testing", "/excel", "/excel-editor", "/{path:[^\\.]*}" })
    public String forwardToFrontend() {
        // Forward to `index.html`, so React Router can handle the routing
        return "forward:/index.html";
    }
}