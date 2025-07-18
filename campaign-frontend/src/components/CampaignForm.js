import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const keywordOptions = [
  'shoes','hats','books','gadgets','electronics','games','clothing'
];

export default function CampaignForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (editMode) {
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
    }
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      name: form.name,
      keywords: form.keywords.split(',').map(s => s.trim()).filter(Boolean),
      bidAmount: parseFloat(form.bidAmount),
      campaignFund: parseFloat(form.campaignFund),
      status: form.status,
      town: form.town || null,
      radiusKm: parseInt(form.radiusKm, 10)
    };

    const req = editMode
      ? api.put(`/campaigns/${id}`, payload)
      : api.post('/campaigns', payload);

    req.then(() => navigate('/campaigns'))
       .catch(console.error);
  };
  
  const townOptions = ['Warsaw','Cracow','Berlin','Helsinki','Barcelona', 'Milano'];
  
  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <h2>{editMode ? 'Edit Campaign' : 'New Campaign'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Keywords (typeahead)</Form.Label>
          <Typeahead
          id="keywords"
          multiple
          options={keywordOptions}
          selected={ form.keywords ? form.keywords.split(',') : [] }
          onChange={selected => setForm(prev => ({
          ...prev,
        keywords: selected.join(',')
        }))}
        placeholder="Choose keywords"
        isInvalid={form.keywords.split(',').filter(Boolean).length === 0}
        clearButton/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bid Amount</Form.Label>
          <Form.Control 
            name="bidAmount"
            type="number" step="0.01"
            value={form.bidAmount}
            onChange={handleChange}
            required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Campaign Fund</Form.Label>
          <Form.Control 
            name="campaignFund"
            type="number" step="0.01"
            value={form.campaignFund}
            onChange={handleChange}
            required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            name="status"
            label="Status ON?"
            type="checkbox"
            checked={form.status}
            onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Town</Form.Label>
            <Form.Select name="town" value={form.town} onChange={handleChange} required>
                <option value="">Choose Town</option>
                 {townOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Radius (km)</Form.Label>
          <Form.Control 
            name="radiusKm"
            type="number"
            value={form.radiusKm}
            onChange={handleChange}
            required />
        </Form.Group>

        <Button type="submit" variant="primary">
          {editMode ? 'Save changes' : 'Create'}
        </Button>
      </Form>
    </>
  );
}
