package com.example.campaign.service.impl;

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

    private Campaign example;

    @BeforeEach
    void setUp() {
        example = new Campaign();
        example.setId(1L);
        example.setName("Test");
        example.setBidAmount(BigDecimal.TEN);
        example.setCampaignFund(BigDecimal.valueOf(100));
        example.setStatus(true);
    }

    @Test
    void create_ShouldDeductFundsAndSave() {
        // given
        when(accountService.deduct(example.getCampaignFund()))
                .thenReturn(BigDecimal.valueOf(900));
        when(repo.save(example)).thenReturn(example);

        // when
        Campaign saved = service.create(example);

        // then
        assertThat(saved).isSameAs(example);
        verify(accountService).deduct(example.getCampaignFund());
        verify(repo).save(example);
    }

    @Test
    void create_WhenInsufficientFunds_ShouldThrow() {
        // given:
        when(accountService.deduct(example.getCampaignFund()))
                .thenThrow(new InsufficientFundsException(example.getCampaignFund()));

        // when / then
        assertThatThrownBy(() -> service.create(example))
                .isInstanceOf(InsufficientFundsException.class)
                .hasMessageContaining("Not enough funds");
        verify(repo, never()).save(any());
    }

    @Test
    void update_WhenExists_ShouldSaveWithNewId() {
        // given
        Campaign updated = new Campaign();
        updated.setName("Updated");
        updated.setCampaignFund(BigDecimal.valueOf(50));
        updated.setBidAmount(BigDecimal.ONE);
        updated.setStatus(false);

        // repo.existsById + account deduction + repo.save
        when(repo.existsById(1L)).thenReturn(true);
        when(accountService.deduct(updated.getCampaignFund())).thenReturn(BigDecimal.valueOf(950));
        when(repo.save(updated)).thenReturn(updated);

        // when
        Campaign result = service.update(1L, updated);

        // then
        assertThat(result).isSameAs(updated);
        verify(accountService).deduct(updated.getCampaignFund());
        verify(repo).save(updated);
    }

    @Test
    void update_WhenNotExists_ShouldThrow() {
        // given
        when(repo.existsById(99L)).thenReturn(false);

        // when / then
        assertThatThrownBy(() -> service.update(99L, example))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campaign not found");
        verify(accountService, never()).deduct(any());
        verify(repo, never()).save(any());
    }

    @Test
    void delete_WhenExists_ShouldCallRepoDelete() {
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
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campaign not found");
    }
}
