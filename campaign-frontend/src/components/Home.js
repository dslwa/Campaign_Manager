import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import DepositForm from "../components/DepositForm";

export default function Home() {
  const [balance, setBalance] = useState(null);
  const [count, setCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/account/balance")
      .then((res) => setBalance(res.data.balance))
      .catch(console.error);
  }, []);

  useEffect(() => {
    api
      .get("/campaigns")
      .then((res) => setCount(res.data.length))
      .catch(console.error);
  }, []);

  if (balance === null || count === null) {
    return <Spinner animation="border" />;
  }

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: 500 }}>
      <Card.Body>
        <Card.Title>Welcome to Campaign Manager</Card.Title>
        <p>
          <strong>Active campaigns:</strong> {count}
          <br />
          <strong>Account balance:</strong> ${balance.toFixed(2)}
        </p>

        <DepositForm onBalanceUpdate={setBalance} />

        <div className="d-flex justify-content-between mt-4">
          <Button variant="primary" onClick={() => navigate("/campaigns")}>
            View Campaigns
          </Button>
          <Button variant="success" onClick={() => navigate("/campaigns/new")}>
            New Campaign
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
