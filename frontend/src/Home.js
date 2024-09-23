import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
  return (
    <Container className="text-center" style={{ marginTop: '50px' }}>
      <Row>
        <Col>
          <Link to="/tenant-login">
            <Button variant="primary" size="lg">
              Login as Tenant
            </Button>
          </Link>
        </Col>
        <Col>
          <Link to="/landlord-login">
            <Button variant="success" size="lg">
              Login as Landlord
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
