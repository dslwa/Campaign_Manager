package com.example.campaign.api.controller;

import com.example.campaign.persistence.CampaignRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/keywords")
public class KeywordController {

    private final CampaignRepository repo;

    public KeywordController(CampaignRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<String> getKeywords() {
        return repo.findAll().stream()
                .flatMap(c -> c.getKeywords().stream())
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
