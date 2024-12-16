CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  city VARCHAR(100),
  price DECIMAL
);

INSERT INTO properties (title, city, price) VALUES
('Luxury Apartment', 'London', 500000),
('Cozy Cottage', 'Edinburgh', 250000),
('Modern Flat', 'Manchester', 300000);