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
  const [errors, setErrors] = useState([]);

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

    const newErrors = [];
    if (!form.name.trim()) newErrors.push("Name is required.");
    if (!keywords.length) newErrors.push("At least one keyword is required.");
    const bid = parseFloat(form.bidAmount);
    if (isNaN(bid) || bid < 0.01)
      newErrors.push("Bid Amount must be at least 0.01.");
    const fund = parseFloat(form.campaignFund);
    if (isNaN(fund) || fund < 0)
      newErrors.push("Campaign Fund must be zero or positive.");
    if (!form.town) newErrors.push("Town is required.");
    const radius = parseInt(form.radiusKm, 10);
    if (isNaN(radius) || radius < 0)
      newErrors.push("Radius must be zero or positive.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);

    const payload = {
      name: form.name,
      keywords,
      bidAmount: bid,
      campaignFund: fund,
      status: form.status,
      town: form.town || null,
      radiusKm: radius,
    };

    const req = editMode
      ? api.put(`/campaigns/${id}`, payload)
      : api.post("/campaigns", payload);

    req
      .then(() => api.get("/account/balance"))
      .then((r) => {
        setBalance(r.data.balance);
        navigate("/campaigns");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          const msg = err.response.data.message;
          const list = Array.isArray(msg)
            ? msg
            : [msg || "An error occurred while saving."];
          setErrors(list);
        } else {
          console.error(err);
          setErrors(["An unexpected error occurred while saving."]);
        }
      })
      .finally(() => setSubmitting(false));
  };

  if (loading || balance === null) {
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  }

  // determine invalid states
  const invalidFields = (field) =>
    errors.some((err) => err.toLowerCase().includes(field));

  return (
    <>
      <h2>{editMode ? "Edit Campaign" : "New Campaign"}</h2>
      <p>
        Current account balance: <strong>${balance.toFixed(2)}</strong>
      </p>

      {errors.length > 0 && (
        <Alert variant="danger">
          <ul className="mb-0">
            {errors.map((errMsg, idx) => (
              <li key={idx}>{errMsg}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={handleChange}
            isInvalid={invalidFields("name")}
          />
          <Form.Control.Feedback type="invalid">
            Name is required.
          </Form.Control.Feedback>
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
            isInvalid={invalidFields("keyword")}
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
            isInvalid={invalidFields("bid amount")}
          />
          <Form.Control.Feedback type="invalid">
            Bid Amount must be at least 0.01.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Campaign Fund</Form.Label>
          <Form.Control
            name="campaignFund"
            type="number"
            step="0.01"
            value={form.campaignFund}
            onChange={handleChange}
            isInvalid={invalidFields("campaign fund")}
          />
          <Form.Control.Feedback type="invalid">
            Campaign Fund must be zero or positive.
          </Form.Control.Feedback>
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
            isInvalid={invalidFields("town")}
          >
            <option value="">— choose town —</option>
            {townOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Town is required.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Radius (km)</Form.Label>
          <Form.Control
            name="radiusKm"
            type="number"
            value={form.radiusKm}
            onChange={handleChange}
            isInvalid={invalidFields("radius")}
          />
          <Form.Control.Feedback type="invalid">
            Radius must be zero or positive.
          </Form.Control.Feedback>
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
