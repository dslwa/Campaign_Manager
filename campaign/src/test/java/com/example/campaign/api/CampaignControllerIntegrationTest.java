package com.example.campaign.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class CampaignControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllCampaigns_ShouldReturnSeededList() throws Exception {
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(10)));
    }

    @Test
    void getById_WhenExists_ShouldReturnOne() throws Exception {
        mockMvc.perform(get("/api/campaigns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Shoes Sale")));
    }

    @Test
    void getById_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/campaigns/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_InvalidPayload_ShouldReturn400() throws Exception {
        String body = """
        { "name": "", "keywords": [], "bidAmount": 0.0, "campaignFund": -10, "status": true }
        """;
        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                // message jest listą, sprawdź konkretny element
                .andExpect(jsonPath("$.message", hasItem("name: must not be blank")));
    }

    @Test
    void create_ValidPayload_ShouldReturn201() throws Exception {
        String body = """
          {
            "name": "Z Test",
            "keywords": ["foo","bar"],
            "bidAmount": 0.10,
            "campaignFund": 1.00,
            "status": true,
            "town": "Warsaw",
            "radiusKm": 5
          }
          """;
        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Z Test")));
    }

    @Test
    void delete_WhenExists_ShouldReturn204() throws Exception {
         mockMvc.perform(delete("/api/campaigns/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/campaigns/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void accountEndpoints_ShouldWorkAndValidate() throws Exception {
        // initial balance
        mockMvc.perform(get("/api/account/balance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance", notNullValue()));

        // deposit positive
        mockMvc.perform(post("/api/account/deposit")
                        .param("amount","5.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance", greaterThanOrEqualTo(5.00)));

        // deposit negative → validation error
        mockMvc.perform(post("/api/account/deposit")
                        .param("amount","-1.00"))
                .andExpect(status().isBadRequest());

        // deduct too much → insufficient funds
        mockMvc.perform(post("/api/account/deduct")
                        .param("amount","999999.00"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cors_NotAllowedOrigin_ShouldReject() throws Exception {
        mockMvc.perform(get("/api/campaigns")
                        .header("Origin", "http://evil.com"))
                .andExpect(status().isForbidden());
    }

    @Test
    void cors_AllowedOrigin_ShouldReturn200AndHeader() throws Exception {
        mockMvc.perform(get("/api/campaigns")
                        .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }
}
