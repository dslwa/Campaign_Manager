// src/components/CampaignForm.js

import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function CampaignForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [keywordOptions, setKeywordOptions] = useState([]);
  const [townOptions, setTownOptions] = useState([]);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    api
      .get("/keywords")
      .then((r) => setKeywordOptions(r.data))
      .catch(console.error);
    api
      .get("/towns")
      .then((r) => setTownOptions(r.data))
      .catch(console.error);
  }, []);

  const [balance, setBalance] = useState(null);
  useEffect(() => {
    api
      .get("/account/balance")
      .then((r) => setBalance(r.data.balance))
      .catch(console.error);
  }, []);

  const [form, setForm] = useState({
    name: "",
    bidAmount: "",
    campaignFund: "",
    status: false,
    town: "",
    radiusKm: "",
  });
  const [loading, setLoading] = useState(editMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!editMode) return;
    api
      .get(`/campaigns/${id}`)
      .then((r) => {
        const c = r.data;
        setForm({
          name: c.name,
          bidAmount: c.bidAmount,
          campaignFund: c.campaignFund,
          status: c.status,
          town: c.town || "",
          radiusKm: c.radiusKm,
        });
        setKeywords(c.keywords);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    if (!keywords.length) {
      setError("You must select at least one keyword.");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      keywords,
      bidAmount: parseFloat(form.bidAmount),
      campaignFund: parseFloat(form.campaignFund),
      status: form.status,
      town: form.town || null,
      radiusKm: parseInt(form.radiusKm, 10),
    };

    const campaignReq = editMode
      ? api.put(`/campaigns/${id}`, payload)
      : api.post("/campaigns", payload);

    campaignReq

      .then(() => api.get("/account/balance"))
      .then((r) => {
        setBalance(r.data.balance);
        navigate("/campaigns");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setError(err.response.data.message || "Insufficient funds.");
        } else {
          console.error(err);
          setError("An error occurred while saving.");
        }
      })
      .finally(() => setSubmitting(false));
  };

  if (loading || balance === null) {
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  }

  return (
    <>
      <h2>{editMode ? "Edit Campaign" : "New Campaign"}</h2>
      <p>
        Current account balance: <strong>${balance.toFixed(2)}</strong>
      </p>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Keywords</Form.Label>
          <Typeahead
            id="keywords"
            multiple
            options={keywordOptions}
            selected={keywords}
            onChange={setKeywords}
            placeholder="Select keywords..."
            clearButton
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bid Amount</Form.Label>
          <Form.Control
            name="bidAmount"
            type="number"
            step="0.01"
            value={form.bidAmount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Campaign Fund</Form.Label>
          <Form.Control
            name="campaignFund"
            type="number"
            step="0.01"
            value={form.campaignFund}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            name="status"
            label="Status On?"
            type="checkbox"
            checked={form.status}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Town</Form.Label>
          <Form.Select
            name="town"
            value={form.town}
            onChange={handleChange}
            required
          >
            <option value="">— choose town —</option>
            {townOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Radius (km)</Form.Label>
          <Form.Control
            name="radiusKm"
            type="number"
            value={form.radiusKm}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Saving…
            </>
          ) : editMode ? (
            "Save Changes"
          ) : (
            "Create Campaign"
          )}
        </Button>
      </Form>
    </>
  );
}
