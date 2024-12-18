import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './PropertyList.css';

type Property = {
  id: number;
  name: string;
  description: string;
  city: string;
  price: number;
  room_type: string;
  minimum_nights: number;
  image: string;
};

const usePropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:8000/search');
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Property[] = await response.json();
      const shuffledProperties = data
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
      setProperties(shuffledProperties);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching properties:', errorMessage);
      setError('Failed to load properties. Please try again later.');
    }
  };

  const searchProperties = async () => {
    try {
      const response = await fetch('http://localhost:8000/search');
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Property[] = await response.json();
      const filteredProperties = data.filter((property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProperties(filteredProperties);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error searching properties:', errorMessage);
      setError('Failed to search properties. Please try again later.');
    }
  };

  return {
    properties,
    error,
    searchTerm,
    setSearchTerm,
    fetchProperties,
    searchProperties,
  };
};

const PropertyList: React.FC = () => {
  const {
    properties,
    error,
    searchTerm,
    setSearchTerm,
    fetchProperties,
    searchProperties,
  } = usePropertyManagement();

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchProperties();
    }
  };

  const highlightText = (text: string): React.ReactNode => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="highlighted-text">{part}</span>
      ) : part
    );
  };

  return (
    <Container>
      <h1 className="text-center mb-4">Property Listings</h1>
      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <Form className="d-flex">
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter property name"
              aria-label="Property search"
            />
            <Button 
              variant="primary" 
              onClick={searchProperties}
              className="ms-2"
            >
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row>
        {properties.length > 0 ? (
          properties.map((property) => (
            <Col key={property.id} xs={12} className="mb-3">
              <Card className="property-box">
                <div className="d-flex">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="property-image"
                  />
                  <div className="property-details">
                    <h3>{highlightText(property.name)}</h3>
                    <p>{property.description}</p>
                    <dl className="property-info">
                      <div className="property-info-item">
                        <dt>Price:</dt>
                        <dd>${property.price}</dd>
                      </div>
                      <div className="property-info-item">
                        <dt>Room Type:</dt>
                        <dd>{property.room_type}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
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
};

export default PropertyList;
