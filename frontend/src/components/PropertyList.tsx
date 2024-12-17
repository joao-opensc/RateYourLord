import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './PropertyList.css';

// Define types in a separate section for better organization
type Property = {
  id: number;
  name: string;
  description: string;
  city: string;
  price: number;
  room_type: string;
  minimum_nights: number;
};

// Define props interface (even if empty, for future extensibility)
interface PropertyListProps {}

// Define custom hook for property management
const usePropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchProperties = async (): Promise<void> => {
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

  const searchProperties = async (): Promise<void> => {
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

// Main component
const PropertyList: React.FC<PropertyListProps> = () => {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
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
        <span key={index} className="highlighted-text">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Container className="mt-5">
      <h1
        className="text-center mb-4 clickable-header"
        onClick={fetchProperties}
        role="button"
        tabIndex={0}
      >
        Property Listings
      </h1>

      <Form className="mb-4 text-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter property name"
              aria-label="Property search"
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
                  <Card.Title>{highlightText(property.name)}</Card.Title>
                  <Card.Text>{property.description}</Card.Text>
                  <dl className="property-details">
                    <dt>Price</dt>
                    <dd>${property.price}</dd>
                    <dt>Room Type</dt>
                    <dd>{property.room_type}</dd>
                    <dt>Minimum Nights</dt>
                    <dd>{property.minimum_nights}</dd>
                  </dl>
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
};

export default PropertyList; 