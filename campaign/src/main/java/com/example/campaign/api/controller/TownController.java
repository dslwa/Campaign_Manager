package com.example.campaign.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TownController {

    private static final List<String> TOWNS = List.of(
            "Warsaw", "Cracow", "Gdańsk", "Poznań", "Berlin", "Helsinki", "Barcelona", "Milano"
    );

    @GetMapping("/api/towns")
    public List<String> getAllTowns() {
        return TOWNS;
    }
}