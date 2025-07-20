package com.example.campaign.api.controller;

import com.example.campaign.api.controller.CampaignController;
import com.example.campaign.api.mapper.CampaignMapper;
import com.example.campaign.exception.GlobalExceptionHandler;
import com.example.campaign.service.CampaignService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class CampaignValidationTest {

    @Mock
    private CampaignService campaignService;

    @Mock
    private CampaignMapper campaignMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        CampaignController controller =
                new CampaignController(campaignService, campaignMapper);

        this.mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void create_MissingName_ShouldReturn400() throws Exception {
        String payload = """
            {
              "name": "",
              "keywords": ["a"],
              "bidAmount": 0.01,
              "campaignFund": 0.00,
              "status": true
            }
            """;

        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", hasItem("name: must not be blank")));

        verifyNoInteractions(campaignService);
    }

    @Test
    void create_NoKeywords_ShouldReturn400() throws Exception {
        String payload = """
            {
              "name": "X",
              "keywords": [],
              "bidAmount": 0.01,
              "campaignFund": 0.00,
              "status": true
            }
            """;

        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", hasItem("keywords: must not be empty")));

        verifyNoInteractions(campaignService);
    }
}
