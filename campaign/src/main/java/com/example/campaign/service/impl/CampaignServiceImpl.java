package com.example.campaign.service.impl;

import com.example.campaign.exception.CampaignNotFoundException;
import com.example.campaign.model.Campaign;
import com.example.campaign.persistence.CampaignRepository;
import com.example.campaign.service.AccountService;
import com.example.campaign.service.CampaignService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository repo;
    private final AccountService accountSvc;

    public CampaignServiceImpl(CampaignRepository repo, AccountService accountSvc) {
        this.repo = repo;
        this.accountSvc = accountSvc;
    }

    @Override
    public List<Campaign> listAll() {
        return repo.findAll();
    }

    @Override
    public Campaign getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new CampaignNotFoundException(id));
    }

    @Override
    @Transactional
    public Campaign create(Campaign c) {
        accountSvc.deduct(c.getCampaignFund());
        return repo.save(c);
    }

    @Override
    @Transactional
    public Campaign update(Long id, Campaign c) {
        if (!repo.existsById(id)) {
            throw new CampaignNotFoundException(id);
        }
        accountSvc.deduct(c.getCampaignFund());
        c.setId(id);
        return repo.save(c);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new CampaignNotFoundException(id);
        }
        repo.deleteById(id);
    }
}
