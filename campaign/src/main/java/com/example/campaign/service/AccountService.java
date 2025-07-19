package com.example.campaign.service;

import java.math.BigDecimal;

public interface AccountService {
    BigDecimal getBalance();
    BigDecimal deduct(BigDecimal amount);
    BigDecimal deposit(BigDecimal amount);
}
