package com.example.campaign.service.impl;

import com.example.campaign.exception.CampaignNotFoundException;
import com.example.campaign.exception.InsufficientFundsException;
import com.example.campaign.model.Campaign;
import com.example.campaign.persistence.CampaignRepository;
import com.example.campaign.service.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class CampaignServiceImplTest {

    @Mock
    private CampaignRepository repo;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private CampaignServiceImpl service;

    private Campaign existing;

    @BeforeEach
    void setUp() {
        // Kampania istniejąca w repo (fundusz = 100)
        existing = new Campaign();
        existing.setId(1L);
        existing.setName("Orig");
        existing.setBidAmount(BigDecimal.TEN);
        existing.setCampaignFund(BigDecimal.valueOf(100));
        existing.setStatus(true);
    }

    @Test
    void create_ShouldDeductFundsAndSave() {
        // given
        when(accountService.deduct(existing.getCampaignFund()))
                .thenReturn(BigDecimal.valueOf(900));
        when(repo.save(existing)).thenReturn(existing);

        // when
        Campaign saved = service.create(existing);

        // then
        assertThat(saved).isSameAs(existing);
        verify(accountService).deduct(existing.getCampaignFund());
        verify(repo).save(existing);
    }

    @Test
    void create_WhenInsufficientFunds_ShouldThrowAndNotSave() {
        // given
        when(accountService.deduct(existing.getCampaignFund()))
                .thenThrow(new InsufficientFundsException(existing.getCampaignFund()));

        // when / then
        assertThatThrownBy(() -> service.create(existing))
                .isInstanceOf(InsufficientFundsException.class)
                .hasMessageContaining("Not enough funds");
        verify(repo, never()).save(any());
    }

    @Test
    void update_WhenNotFound_ShouldThrow() {
        // given
        when(repo.findById(42L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> service.update(42L, new Campaign()))
                .isInstanceOf(CampaignNotFoundException.class)
                .hasMessageContaining("Campaign not found");
        verify(accountService, never()).deduct(any());
        verify(accountService, never()).deposit(any());
        verify(repo, never()).save(any());
    }

    @Test
    void update_FundIncreased_ShouldDeductOnlyDifference() {
        Campaign updated = new Campaign();
        updated.setCampaignFund(BigDecimal.valueOf(150));
        // mock findById
        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(accountService.deduct(BigDecimal.valueOf(50))).thenReturn(BigDecimal.valueOf(850));
        when(repo.save(updated)).thenReturn(updated);

        // when
        Campaign result = service.update(1L, updated);

        // then
        assertThat(result).isSameAs(updated);
        verify(accountService).deduct(BigDecimal.valueOf(50));
        verify(accountService, never()).deposit(any());
        verify(repo).save(updated);
        assertThat(updated.getId()).isEqualTo(1L);
    }

    @Test
    void update_FundDecreased_ShouldDepositDifference() {
        // przygotuj obiekt nowej kampanii z mniejszym funduszem (80)
        Campaign updated = new Campaign();
        updated.setCampaignFund(BigDecimal.valueOf(80));
        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(accountService.deposit(BigDecimal.valueOf(20))).thenReturn(BigDecimal.valueOf(120));
        when(repo.save(updated)).thenReturn(updated);

        // when
        Campaign result = service.update(1L, updated);

        // then
        assertThat(result).isSameAs(updated);

        verify(accountService).deposit(BigDecimal.valueOf(20));
        verify(accountService, never()).deduct(any());
        verify(repo).save(updated);
        assertThat(updated.getId()).isEqualTo(1L);
    }

    @Test
    void update_FundUnchanged_ShouldNotAdjustAccount() {
        Campaign updated = new Campaign();
        updated.setCampaignFund(BigDecimal.valueOf(100));
        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(updated)).thenReturn(updated);

        // when
        Campaign result = service.update(1L, updated);

        // then
        assertThat(result).isSameAs(updated);
        verify(accountService, never()).deduct(any());
        verify(accountService, never()).deposit(any());
        verify(repo).save(updated);
        assertThat(updated.getId()).isEqualTo(1L);
    }

    @Test
    void delete_WhenExists_ShouldCallRepoDelete() {
        // przygotuj mock
        when(repo.existsById(2L)).thenReturn(true);

        // when
        service.delete(2L);

        // then
        verify(repo).deleteById(2L);
    }

    @Test
    void delete_WhenNotExists_ShouldThrow() {
        when(repo.existsById(3L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(3L))
                .isInstanceOf(CampaignNotFoundException.class)
                .hasMessageContaining("Campaign not found");
    }
}
