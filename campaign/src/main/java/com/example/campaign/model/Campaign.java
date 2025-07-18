package com.example.campaign.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "campaign")
public class Campaign {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ElementCollection
    @CollectionTable(name = "campaign_keyword", joinColumns = @JoinColumn(name = "campaign_id"))
    @Column(name = "keyword")
    private List<String> keywords;

    @Column(nullable = false)
    private BigDecimal bidAmount;

    @Column(nullable = false)
    private BigDecimal campaignFund;

    @Column(nullable = false)
    private Boolean status;

    private String town;

    @Column(name = "radius_km")
    private Integer radiusKm;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }

    public BigDecimal getBidAmount() { return bidAmount; }
    public void setBidAmount(BigDecimal bidAmount) { this.bidAmount = bidAmount; }

    public BigDecimal getCampaignFund() { return campaignFund; }
    public void setCampaignFund(BigDecimal campaignFund) { this.campaignFund = campaignFund; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public String getTown() { return town; }
    public void setTown(String town) { this.town = town; }

    public Integer getRadiusKm() { return radiusKm; }
    public void setRadiusKm(Integer radiusKm) { this.radiusKm = radiusKm; }
}
