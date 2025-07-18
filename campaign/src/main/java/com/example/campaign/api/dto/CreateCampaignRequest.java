package com.example.campaign.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record CreateCampaignRequest(
        @NotBlank String name,
        @NotEmpty List<@NotBlank String> keywords,
        @DecimalMin("0.01") BigDecimal bidAmount,
        @DecimalMin("0.00") BigDecimal campaignFund,
        @NotNull Boolean status,
        String town,
        @Min(0) Integer radiusKm
) {}
