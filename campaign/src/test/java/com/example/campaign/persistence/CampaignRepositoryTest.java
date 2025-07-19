package com.example.campaign.persistence;
import com.example.campaign.model.Campaign;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class CampaignRepositoryTest {

    @Autowired
    private CampaignRepository repo;

    @Test
    void saveAndFindById_ShouldPersistKeywords() {
        Campaign c = new Campaign();
        c.setName("RepoTest");
        c.setBidAmount(BigDecimal.valueOf(0.5));
        c.setCampaignFund(BigDecimal.valueOf(10));
        c.setStatus(true);
        c.setTown("TestTown");
        c.setRadiusKm(7);
        c.setKeywords(List.of("a","b","c"));

        Campaign saved = repo.save(c);
        Optional<Campaign> loaded = repo.findById(saved.getId());

        assertThat(loaded).isPresent();
        assertThat(loaded.get().getKeywords()).containsExactly("a","b","c");
    }

    @Test
    void delete_ShouldRemoveEntity() {
        Campaign c = new Campaign();
        c.setName("ToDelete");
        c.setBidAmount(BigDecimal.ONE);
        c.setCampaignFund(BigDecimal.TEN);
        c.setStatus(false);
        c.setKeywords(List.of("x"));
        c.setRadiusKm(1);

        Campaign saved = repo.save(c);
        repo.deleteById(saved.getId());
        assertThat(repo.findById(saved.getId())).isEmpty();
    }
}
