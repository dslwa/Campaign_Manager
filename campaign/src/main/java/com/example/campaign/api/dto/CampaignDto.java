package com.example.campaign.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record CampaignDto(
        Long id,
        String name,
        List<String> keywords,
        BigDecimal bidAmount,
        BigDecimal campaignFund,
        Boolean status,
        String town,
        Integer radiusKm
) {}
