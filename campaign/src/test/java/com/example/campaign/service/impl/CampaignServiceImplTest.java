package com.example.campaign.service.impl;

import com.example.campaign.exception.CampaignNotFoundException;
import com.example.campaign.model.Campaign;
import com.example.campaign.persistence.CampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignServiceImplTest {

    @Mock
    private CampaignRepository repo;

    @InjectMocks
    private CampaignServiceImpl service;

    @Captor
    private ArgumentCaptor<Campaign> campaignCaptor;

    private Campaign c1, c2;

    @BeforeEach
    void init() {
        c1 = new Campaign();
        c1.setId(1L);
        c1.setName("One");
        c1.setBidAmount(BigDecimal.valueOf(1.0));
        c1.setCampaignFund(BigDecimal.valueOf(10.0));
        c1.setStatus(true);

        c2 = new Campaign();
        c2.setId(2L);
        c2.setName("Two");
        c2.setBidAmount(BigDecimal.valueOf(2.0));
        c2.setCampaignFund(BigDecimal.valueOf(20.0));
        c2.setStatus(false);
    }

    @Test
    void listAll_ShouldReturnAll() {
        when(repo.findAll()).thenReturn(List.of(c1, c2));

        var result = service.listAll();

        assertThat(result)
                .hasSize(2)
                .containsExactly(c1, c2);

        verify(repo).findAll();
    }

    @Test
    void getById_WhenExists_ShouldReturnEntity() {
        when(repo.findById(1L)).thenReturn(Optional.of(c1));

        var found = service.getById(1L);

        assertThat(found).isSameAs(c1);
        verify(repo).findById(1L);
    }

    @Test
    void getById_WhenMissing_ShouldThrow() {
        when(repo.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(42L))
                .isInstanceOf(CampaignNotFoundException.class)
                .hasMessageContaining("42");

        verify(repo).findById(42L);
    }

    @Test
    void create_ShouldSaveAndReturn() {
        when(repo.save(c1)).thenReturn(c1);

        var saved = service.create(c1);

        assertThat(saved).isSameAs(c1);
        verify(repo).save(c1);
    }

    @Test
    void update_WhenExists_ShouldSaveWithIdAndReturn() {
        Campaign input = new Campaign();
        input.setName("Updated");
        input.setBidAmount(BigDecimal.ONE);
        input.setCampaignFund(BigDecimal.ONE);
        input.setStatus(false);

        when(repo.existsById(5L)).thenReturn(true);
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var out = service.update(5L, input);

        verify(repo).save(campaignCaptor.capture());
        assertThat(campaignCaptor.getValue().getId()).isEqualTo(5L);

        assertThat(out.getId()).isEqualTo(5L);
        assertThat(out.getName()).isEqualTo("Updated");
    }

    @Test
    void update_WhenMissing_ShouldThrow() {
        when(repo.existsById(99L)).thenReturn(false);
        Campaign input = new Campaign();

        assertThatThrownBy(() -> service.update(99L, input))
                .isInstanceOf(CampaignNotFoundException.class)
                .hasMessageContaining("99");

        verify(repo, never()).save(any());
    }

    @Test
    void delete_WhenExists_ShouldCallRepository() {
        when(repo.existsById(3L)).thenReturn(true);

        service.delete(3L);

        verify(repo).deleteById(3L);
    }

    @Test
    void delete_WhenMissing_ShouldThrow() {
        when(repo.existsById(123L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(123L))
                .isInstanceOf(CampaignNotFoundException.class)
                .hasMessageContaining("123");

        verify(repo, never()).deleteById(any());
    }
}
