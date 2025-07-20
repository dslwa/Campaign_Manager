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

  const [filterMinFund, setFilterMinFund] = useState("");
  const [filterMaxFund, setFilterMaxFund] = useState("");
  const [filterMinBid, setFilterMinBid] = useState("");
  const [filterMaxBid, setFilterMaxBid] = useState("");
  const [filterMinRadius, setFilterMinRadius] = useState("");
  const [filterMaxRadius, setFilterMaxRadius] = useState("");

  const [sortField, setSortField] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");

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

    const minFund = parseFloat(filterMinFund);
    if (!isNaN(minFund)) {
      arr = arr.filter((c) => c.campaignFund >= minFund);
    }
    const maxFund = parseFloat(filterMaxFund);
    if (!isNaN(maxFund)) {
      arr = arr.filter((c) => c.campaignFund <= maxFund);
    }
    const minBid = parseFloat(filterMinBid);
    if (!isNaN(minBid)) {
      arr = arr.filter((c) => c.bidAmount >= minBid);
    }
    const maxBid = parseFloat(filterMaxBid);
    if (!isNaN(maxBid)) {
      arr = arr.filter((c) => c.bidAmount <= maxBid);
    }
    const minRadius = parseInt(filterMinRadius, 10);
    if (!isNaN(minRadius)) {
      arr = arr.filter((c) => c.radiusKm >= minRadius);
    }
    const maxRadius = parseInt(filterMaxRadius, 10);
    if (!isNaN(maxRadius)) {
      arr = arr.filter((c) => c.radiusKm <= maxRadius);
    }
    if (sortField !== "none") {
      arr.sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === "id") {
          cmp = a.id - b.id;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    setFiltered(arr);
  }, [
    campaigns,
    filterName,
    filterStatus,
    filterTown,
    filterMinFund,
    filterMaxFund,
    filterMinBid,
    filterMaxBid,
    filterMinRadius,
    filterMaxRadius,
    sortField,
    sortDirection,
  ]);

  const resetFilters = () => {
    setFilterName("");
    setFilterStatus("ALL");
    setFilterTown("ALL");
    setFilterMinFund("");
    setFilterMaxFund("");
    setFilterMinBid("");
    setFilterMaxBid("");
    setFilterMinRadius("");
    setFilterMaxRadius("");
    setSortField("none");
    setSortDirection("asc");
  };

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
        <Row className="g-2 mb-3">
          <Col md={4}>
            <Form.Control
              placeholder="Search by name…"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </Col>
          <Col md={2}>
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
        </Row>

        <Row className="g-2 mb-3">
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Min Fund"
              value={filterMinFund}
              onChange={(e) => setFilterMinFund(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Max Fund"
              value={filterMaxFund}
              onChange={(e) => setFilterMaxFund(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Min Bid"
              value={filterMinBid}
              onChange={(e) => setFilterMinBid(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Max Bid"
              value={filterMaxBid}
              onChange={(e) => setFilterMaxBid(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Min Radius"
              value={filterMinRadius}
              onChange={(e) => setFilterMinRadius(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Max Radius"
              value={filterMaxRadius}
              onChange={(e) => setFilterMaxRadius(e.target.value)}
            />
          </Col>
        </Row>

        <Row className="g-2 align-items-center">
          <Col md={3}>
            <Form.Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="none">No sorting</option>
              <option value="name">Sort by Name</option>
              <option value="id">Sort by Creation Date</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Select>
          </Col>
          <Col md={{ span: 2, offset: 7 }}>
            <Button variant="secondary" onClick={resetFilters}>
              Reset all
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
                    <strong>Bid:</strong> ${c.bidAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Fund:</strong> ${c.campaignFund.toFixed(2)}
                  </p>
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
