package com.example.campaign.api.controller;

import com.example.campaign.api.dto.CampaignDto;
import com.example.campaign.api.dto.CreateCampaignRequest;
import com.example.campaign.api.mapper.CampaignMapper;
import com.example.campaign.model.Campaign;
import com.example.campaign.service.CampaignService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Campaign API")
@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService svc;
    private final CampaignMapper mapper;

    public CampaignController(CampaignService svc, CampaignMapper mapper) {
        this.svc = svc;
        this.mapper = mapper;
    }

    @GetMapping
    public List<CampaignDto> list() {
        return svc.listAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignDto> get(@PathVariable Long id) {
        try {
            Campaign c = svc.getById(id);
            return ResponseEntity.ok(mapper.toDto(c));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<CampaignDto> create(
            @Validated @RequestBody CreateCampaignRequest req) {
        Campaign saved = svc.create(mapper.toEntity(req));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignDto> update(
            @PathVariable Long id,
            @Validated @RequestBody CreateCampaignRequest req) {
        try {
            Campaign updated = svc.update(id, mapper.toEntity(req));
            return ResponseEntity.ok(mapper.toDto(updated));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            svc.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
