import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

import Home from "./components/Home";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    // Toggle on <html> to cover full viewport
    document.documentElement.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Navbar
        bg={darkMode ? "dark" : "light"}
        variant={darkMode ? "dark" : "light"}
        expand="lg"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            Campaign Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/campaigns">
                Campaign List
              </Nav.Link>
              <Nav.Link as={Link} to="/campaigns/new">
                New Campaign
              </Nav.Link>
            </Nav>
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              onClick={() => setDarkMode((dm) => !dm)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/new" element={<CampaignForm />} />
          <Route
            path="/campaigns/:id/edit"
            element={<CampaignForm editMode />}
          />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
