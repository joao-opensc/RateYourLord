import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './PropertyList.css';

function PropertyList() {
  const [city, setCity] = useState('');
  const [properties, setProperties] = useState([]);

  // Fetch all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch('http://backend:5001/search');
      const data = await response.json();
      console.log(data);
      setProperties(data);
    };

    fetchProperties();
  }, []);

  const searchProperties = async () => {
    const response = await fetch(`http://backend:5001/search?city=${city}`);
    const data = await response.json();
    setProperties(data);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Property Listings</h1>
      <Form className="mb-4 text-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
            />
          </Col>
          <Col md={4}>
            <Button variant="primary" onClick={searchProperties}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <div className="property-list">
          {properties.map((property) => (
            <div className="property-box" key={property.id}>
              <h2>{property.name}</h2>
              <p>{property.description}</p>
              <p>City: {property.city}</p>
              <p>Price: ${property.price}</p>
              <p>Room Type: {property.room_type}</p>
              <p>Minimum Nights: {property.minimum_nights}</p>
            </div>
          ))}
        </div>
      </Row>
    </Container>
  );
}

export default PropertyList; 