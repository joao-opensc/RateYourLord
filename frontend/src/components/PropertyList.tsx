import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './PropertyList.css';

interface Property {
  id: number;
  name: string;
  description: string;
  city: string;
  price: number;
  room_type: string;
  minimum_nights: number;
}

const PropertyList: React.FC = () => {
  const [city, setCity] = useState<string>(''); // State for the search input
  const [properties, setProperties] = useState<Property[]>([]); // State for the list of properties
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8000/search');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Property[] = await response.json();
        const shuffledProperties = data.sort(() => 0.5 - Math.random()).slice(0, 12);
        setProperties(shuffledProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      }
    };

    fetchProperties();
  }, []);

  const searchProperties = async () => {
    try {
      const response = await fetch('http://localhost:8000/search');
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Property[] = await response.json();
      const filteredProperties = data.filter((property: Property) =>
        property.name.toLowerCase().includes(city.toLowerCase())
      );
      setProperties(filteredProperties);
    } catch (error) {
      console.error('Error searching properties:', error);
      setError('Failed to search properties. Please try again later.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      searchProperties(); // Call searchProperties on Enter key press
    }
  };

  // Highlight all occurrences of the search term in the property name
  const highlightText = (text: string) => {
    const regex = new RegExp(`(${city})`, 'gi'); // Create a regex to match the search term
    const parts = text.split(regex); // Split the text by the search term
    return parts.map((part, index) =>
      part.toLowerCase() === city.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : part
    );
  };

  const resetProperties = async () => {
    setCity(''); // Clear the search input
    try {
      const response = await fetch('http://localhost:8000/search');
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Property[] = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error resetting properties:', error);
      setError('Failed to reset properties. Please try again later.');
    }
  };

  return (
    <Container className="mt-5">
      <h1
        className="text-center mb-4"
        onClick={resetProperties}
        style={{ cursor: 'pointer' }}
      >
        Property Listings
      </h1>
      <Form className="mb-4 text-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress} // Handle Enter key press
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