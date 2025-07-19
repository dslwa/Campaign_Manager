package com.example.campaign.api.controller;

import com.example.campaign.persistence.CampaignRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/towns")
public class TownController {

    private final CampaignRepository repo;

    public TownController(CampaignRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<String> getAllTowns() {
        return repo.findAll().stream()
                .map(c -> c.getTown())
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
