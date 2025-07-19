package com.example.campaign.api.controller;

import com.example.campaign.api.dto.CampaignDto;
import com.example.campaign.api.dto.CreateCampaignRequest;
import com.example.campaign.api.mapper.CampaignMapper;
import com.example.campaign.exception.CampaignNotFoundException;
import com.example.campaign.exception.GlobalExceptionHandler;
import com.example.campaign.model.Campaign;
import com.example.campaign.service.CampaignService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CampaignControllerTest {

    private MockMvc mvc;

    @Mock
    private CampaignService svc;

    @Mock
    private CampaignMapper mapper;

    @InjectMocks
    private CampaignController ctrl;

    private final ObjectMapper json = new ObjectMapper();

    @BeforeEach
    void setup() {
        mvc = MockMvcBuilders
                .standaloneSetup(ctrl)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void listAllShouldReturnDtos() throws Exception {
        // given
        Campaign e1 = new Campaign(); e1.setId(1L); e1.setName("A");
        Campaign e2 = new Campaign(); e2.setId(2L); e2.setName("B");
        when(svc.listAll()).thenReturn(List.of(e1, e2));

        CampaignDto d1 = new CampaignDto(1L, "A", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, true, null, 0);
        CampaignDto d2 = new CampaignDto(2L, "B", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, false, null, 0);
        when(mapper.toDto(e1)).thenReturn(d1);
        when(mapper.toDto(e2)).thenReturn(d2);

        // when/then
        mvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[1].name", is("B")));

        verify(svc).listAll();
    }

    @Test
    void getByIdExistsShouldReturnDto() throws Exception {
        Campaign entity = new Campaign(); entity.setId(5L); entity.setName("X");
        when(svc.getById(5L)).thenReturn(entity);
        CampaignDto dto = new CampaignDto(5L, "X", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, true, null, 0);
        when(mapper.toDto(entity)).thenReturn(dto);

        mvc.perform(get("/api/campaigns/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(5)))
                .andExpect(jsonPath("$.name", is("X")));
    }

    @Test
    void getByIdNotFoundShouldReturn404() throws Exception {
        when(svc.getById(42L)).thenThrow(new CampaignNotFoundException("Campaign not found: 42"));

        mvc.perform(get("/api/campaigns/42"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createShouldReturnCreatedDto() throws Exception {
        CreateCampaignRequest req = new CreateCampaignRequest(
                "New", List.of("k1","k2"),
                BigDecimal.valueOf(0.5), BigDecimal.valueOf(100),
                true, "Town", 10
        );
        Campaign entity = new Campaign();
        entity.setId(7L);
        when(mapper.toEntity(req)).thenReturn(entity);
        when(svc.create(entity)).thenReturn(entity);
        CampaignDto dto = new CampaignDto(7L, "New", List.of("k1","k2"),
                BigDecimal.valueOf(0.5), BigDecimal.valueOf(100),
                true, "Town", 10);
        when(mapper.toDto(entity)).thenReturn(dto);

        mvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(7)));
    }

    @Test
    void updateExistingShouldReturnUpdatedDto() throws Exception {
        // given
        CreateCampaignRequest req = new CreateCampaignRequest(
                "Upd", List.of("kw"),
                BigDecimal.valueOf(1.0), BigDecimal.valueOf(50),
                false, "Town", 5
        );
        Campaign entity = new Campaign();
        entity.setId(9L);
        when(mapper.toEntity(req)).thenReturn(entity);
        when(svc.update(9L, entity)).thenReturn(entity);
        CampaignDto dto = new CampaignDto(9L, "Upd", List.of("kw"),
                BigDecimal.valueOf(1.0), BigDecimal.valueOf(50),
                false, "Town", 5);
        when(mapper.toDto(entity)).thenReturn(dto);

        // when/then
        mvc.perform(put("/api/campaigns/9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(9)))
                .andExpect(jsonPath("$.name", is("Upd")));
    }

    @Test
    void updateNonExistingShouldReturn404() throws Exception {
        CreateCampaignRequest req = new CreateCampaignRequest(
                "Nope", List.of("x"),
                BigDecimal.ONE, BigDecimal.ONE,
                true, null, 0
        );
        Campaign entity = new Campaign();
        when(mapper.toEntity(req)).thenReturn(entity);
        doThrow(new CampaignNotFoundException("Campaign not found: 99"))
                .when(svc).update(99L, entity);

        mvc.perform(put("/api/campaigns/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteExistingShouldReturnNoContent() throws Exception {
        mvc.perform(delete("/api/campaigns/3"))
                .andExpect(status().isNoContent());

        verify(svc).delete(3L);
    }

    @Test
    void deleteNonExistingShouldReturn404() throws Exception {
        doThrow(new CampaignNotFoundException("Campaign not found: 123"))
                .when(svc).delete(123L);

        mvc.perform(delete("/api/campaigns/123"))
                .andExpect(status().isNotFound());
    }
}
