import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/campaigns')
      .then(res => setCampaigns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const remove = id => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    api.delete(`/campaigns/${id}`)
      .then(fetch)
      .catch(console.error);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h1>Campaigns</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Status</th>
            <th>Town</th>
            <th>Radius (km)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.status ? 'ON' : 'OFF'}</td>
              <td>{c.town || '-'}</td>
              <td>{c.radiusKm != null ? c.radiusKm : '-'}</td>
              <td>
                <Button
                  as={Link}
                  to={`/campaigns/${c.id}/edit`}
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </Button>{' '}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => remove(c.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
