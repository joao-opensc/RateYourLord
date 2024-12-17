import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './PropertyList.css';

function PropertyList() {
  const [city, setCity] = useState('');
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://backend:5001/search');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      }
    };

    fetchProperties();
  }, []);

  const searchProperties = async () => {
    try {
      const response = await fetch(`http://backend:5001/search?city=${city}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error searching properties:', error);
      setError('Failed to search properties. Please try again later.');
    }
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
              aria-label="City search"
            />
          </Col>
          <Col md={4}>
            <Button variant="primary" onClick={searchProperties}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {error && <p className="text-danger text-center">{error}</p>}
      <Row>
        {properties.length > 0 ? (
          properties.map((property) => (
            <Col md={4} key={property.id} className="mb-4">
              <Card className="property-box">
                <Card.Body>
                  <Card.Title>{property.name}</Card.Title>
                  <Card.Text>{property.description}</Card.Text>
                  <Card.Text><strong>City:</strong> {property.city}</Card.Text>
                  <Card.Text><strong>Price:</strong> ${property.price}</Card.Text>
                  <Card.Text><strong>Room Type:</strong> {property.room_type}</Card.Text>
                  <Card.Text><strong>Minimum Nights:</strong> {property.minimum_nights}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No properties found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default PropertyList;