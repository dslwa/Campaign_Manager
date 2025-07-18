package com.example.campaign.service;

import com.example.campaign.model.Campaign;
import java.util.List;

public interface CampaignService {
    List<Campaign> listAll();
    Campaign getById(Long id);
    Campaign create(Campaign c);
    Campaign update(Long id, Campaign c);
    void delete(Long id);
}
