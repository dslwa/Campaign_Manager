import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api/axiosConfig';

export default function DepositForm({ onBalanceUpdate }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleDeposit = e => {
    e.preventDefault();
    setError(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    api.post(`/account/deposit?amount=${amt}`)
      .then(res => {
        onBalanceUpdate(res.data.balance);
        setAmount('');
      })
      .catch(err => {
        console.error(err);
        setError('Deposit failed');
      });
  };

  return (
    <Form onSubmit={handleDeposit} className="mb-3 d-flex align-items-start">
      <Form.Group>
        <Form.Control
          type="number"
          step="0.01"
          placeholder="Deposit amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" variant="success" className="ms-2">
        Deposit
      </Button>
      {error && <Alert variant="danger" className="mt-2 w-100">{error}</Alert>}
    </Form>
  );
}