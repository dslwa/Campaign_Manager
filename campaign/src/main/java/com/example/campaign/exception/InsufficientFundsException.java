package com.example.campaign.exception;

import java.math.BigDecimal;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(BigDecimal amount) {
        super("Not enough funds: required " + amount);
    }
}