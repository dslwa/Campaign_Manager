import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function DepositForm({ onBalanceUpdate }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a positive amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/account/deposit", null, {
        params: { amount: value },
      });
      onBalanceUpdate(res.data.balance);
      setAmount("");
    } catch (e) {
      setError("Deposit failed.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Label>Deposit Funds</Form.Label>
      <InputGroup>
        <FormControl
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" variant="outline-success" disabled={loading}>
          {loading ? "..." : "Deposit"}
        </Button>
      </InputGroup>
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </Form>
  );
}
