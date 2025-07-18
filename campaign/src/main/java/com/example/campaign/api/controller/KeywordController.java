package com.example.campaign.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class KeywordController {

    private static final List<String> DICT = List.of(
            "shoes","hats","books","gadgets","electronics","games","clothing"
    );

    @GetMapping("/api/keywords")
    public List<String> getKeywords() {
        return DICT;
    }
}