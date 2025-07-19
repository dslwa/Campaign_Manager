package com.example.campaign.service.impl;

import com.example.campaign.exception.InsufficientFundsException;
import com.example.campaign.model.Account;
import com.example.campaign.persistence.AccountRepository;
import com.example.campaign.service.AccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;


@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository repo;

    public AccountServiceImpl(AccountRepository repo) {
        this.repo = repo;
    }

    @Override
    public BigDecimal getBalance() {
        return repo.findById(1L)
                .orElseGet(() -> repo.save(new Account(1L, BigDecimal.ZERO)))
                .getBalance();
    }

    @Override
    @Transactional
    public BigDecimal deduct(BigDecimal amount) {
        Account acc = repo.findById(1L)
                .orElseThrow(() -> new RuntimeException("Account missing"));
        if (acc.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(amount);
        }
        acc.setBalance(acc.getBalance().subtract(amount));
        return repo.save(acc).getBalance();
    }

    @Override
    @Transactional
    public BigDecimal deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        Account acc = repo.findById(1L)
                .orElseGet(() -> new Account(1L, BigDecimal.ZERO));
        acc.setBalance(acc.getBalance().add(amount));
        return repo.save(acc).getBalance();
    }
}

