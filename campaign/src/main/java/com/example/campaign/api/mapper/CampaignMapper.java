package com.example.campaign.api.mapper;

import com.example.campaign.api.dto.CampaignDto;
import com.example.campaign.api.dto.CreateCampaignRequest;
import com.example.campaign.model.Campaign;
import org.springframework.stereotype.Component;

@Component
public class CampaignMapper {

    public CampaignDto toDto(Campaign c) {
        return new CampaignDto(
                c.getId(),
                c.getName(),
                c.getKeywords(),
                c.getBidAmount(),
                c.getCampaignFund(),
                c.getStatus(),
                c.getTown(),
                c.getRadiusKm()
        );
    }

    public Campaign toEntity(CreateCampaignRequest req) {
        Campaign c = new Campaign();
        c.setName(req.name());
        c.setKeywords(req.keywords());
        c.setBidAmount(req.bidAmount());
        c.setCampaignFund(req.campaignFund());
        c.setStatus(req.status());
        c.setTown(req.town());
        c.setRadiusKm(req.radiusKm());
        return c;
    }
}
