package com.example.campaign.service.impl;

import com.example.campaign.model.Campaign;
import com.example.campaign.persistence.CampaignRepository;
import com.example.campaign.service.CampaignService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository repo;

    public CampaignServiceImpl(CampaignRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Campaign> listAll() {
        return repo.findAll();
    }

    @Override
    public Campaign getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found: " + id));
    }

    @Override
    public Campaign create(Campaign c) {
        return repo.save(c);
    }

    @Override
    public Campaign update(Long id, Campaign c) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Campaign not found: " + id);
        }
        c.setId(id);
        return repo.save(c);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Campaign not found: " + id);
        }
        repo.deleteById(id);
    }
}
