import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Form,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterTown, setFilterTown] = useState("ALL");
  const [townOptions, setTownOptions] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/campaigns"), api.get("/towns")])
      .then(([campRes, townRes]) => {
        setCampaigns(campRes.data);
        setFiltered(campRes.data);
        setTownOptions(townRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let arr = [...campaigns];
    if (filterName) {
      const term = filterName.toLowerCase();
      arr = arr.filter((c) => c.name.toLowerCase().includes(term));
    }
    if (filterStatus !== "ALL") {
      const wantOn = filterStatus === "ON";
      arr = arr.filter((c) => c.status === wantOn);
    }
    if (filterTown !== "ALL") {
      arr = arr.filter((c) => c.town === filterTown);
    }
    setFiltered(arr);
  }, [filterName, filterStatus, filterTown, campaigns]);

  const remove = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    api
      .delete(`/campaigns/${id}`)
      .then(() => setCampaigns((prev) => prev.filter((c) => c.id !== id)))
      .catch(console.error);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <h1 className="mb-4">Campaigns</h1>

      <Form className="mb-4">
        <Row className="g-2">
          <Col md={4}>
            <Form.Control
              placeholder="Search by name…"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="ON">ON</option>
              <option value="OFF">OFF</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterTown}
              onChange={(e) => setFilterTown(e.target.value)}
            >
              <option value="ALL">All towns</option>
              {townOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button
              variant="secondary"
              onClick={() => {
                setFilterName("");
                setFilterStatus("ALL");
                setFilterTown("ALL");
              }}
            >
              Reset filters
            </Button>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {filtered.length === 0 ? (
          <Col>
            <Card className="text-center">
              <Card.Body className="text-muted">No campaigns found</Card.Body>
            </Card>
          </Col>
        ) : (
          filtered.map((c) => (
            <Col key={c.id}>
              <Card>
                <Card.Header>
                  <strong>#{c.id}</strong> – {c.name}
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Status:</strong> {c.status ? "ON" : "OFF"}
                  </p>
                  <p>
                    <strong>Town:</strong> {c.town || "—"}
                  </p>
                  <p>
                    <strong>Radius:</strong> {c.radiusKm} km
                  </p>
                  <Button
                    as={Link}
                    to={`/campaigns/${c.id}/edit`}
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => remove(c.id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
