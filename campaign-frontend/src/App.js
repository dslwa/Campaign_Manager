import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import CampaignList from './components/CampaignList';
import CampaignForm from './components/CampaignForm';

function App() {
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Campaign Manager</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/campaigns">Campaign List</Nav.Link>
            <Nav.Link as={Link} to="/campaigns/new">New Campaign</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/new" element={<CampaignForm />} />
          <Route path="/campaigns/:id/edit" element={<CampaignForm editMode />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
