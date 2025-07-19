import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import DepositForm from './DepositForm';

export default function CampaignForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [keywordOptions, setKeywordOptions] = useState([]);
  const [townOptions, setTownOptions] = useState([]);
  useEffect(() => {
    api.get('/keywords').then(res => setKeywordOptions(res.data)).catch(console.error);
    api.get('/towns').then(res => setTownOptions(res.data)).catch(console.error);
  }, []);

  const [balance, setBalance] = useState(null);
  useEffect(() => {
    api.get('/account/balance').then(res => setBalance(res.data.balance)).catch(console.error);
  }, []);

  const [form, setForm] = useState({
    name: '',
    keywords: '',
    bidAmount: '',
    campaignFund: '',
    status: false,
    town: '',
    radiusKm: ''
  });
  const [loading, setLoading] = useState(editMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!editMode) return;
    api.get(`/campaigns/${id}`)
      .then(res => {
        const c = res.data;
        setForm({
          name: c.name,
          keywords: c.keywords.join(','),
          bidAmount: c.bidAmount,
          campaignFund: c.campaignFund,
          status: c.status,
          town: c.town,
          radiusKm: c.radiusKm
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      keywords: form.keywords.split(',').map(s => s.trim()).filter(Boolean),
      bidAmount: parseFloat(form.bidAmount),
      campaignFund: parseFloat(form.campaignFund),
      status: form.status,
      town: form.town || null,
      radiusKm: parseInt(form.radiusKm, 10)
    };

    if (!payload.keywords.length) {
      setError('You must select at least one keyword.');
      return;
    }

    const campaignReq = editMode
      ? api.put(`/campaigns/${id}`, payload)
      : api.post('/campaigns', payload);

    campaignReq
      .then(() => api.post(`/account/deduct?amount=${payload.campaignFund}`))
      .then(res => {
        setBalance(res.data.balance);
        navigate('/campaigns');
      })
      .catch(err => {
        if (err.response?.status === 400) {
          setError(err.response.data.message || 'Insufficient funds.');
        } else {
          console.error(err);
          setError('An error occurred while saving.');
        }
      });
  };

  if (loading || balance === null) return <Spinner animation="border" />;

  return (
    <>
      <h2>{editMode ? 'Edit Campaign' : 'New Campaign'}</h2>
      <p>Current account balance: <strong>{balance}</strong></p>

      <DepositForm onBalanceUpdate={setBalance} />

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
  
        <Form.Group className="mb-3">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Keywords</Form.Label>
          <Typeahead
            id="keywords"
            multiple
            options={keywordOptions}
            selected={form.keywords ? form.keywords.split(',') : []}
            onChange={selected => setForm(prev => ({ ...prev, keywords: selected.join(',') }))}
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
          <Form.Select name="town" value={form.town} onChange={handleChange} required>
            <option value="">-- choose town --</option>
            {townOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </Form.Select>
        </Form.Group>

        {/* Radius */}
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

        <Button type="submit" variant="primary">
          {editMode ? 'Save Changes' : 'Create Campaign'}
        </Button>
      </Form>
    </>
  );
}