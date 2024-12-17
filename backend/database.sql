CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  host_id INT,
  host_name VARCHAR(255),
  neighbourhood_group VARCHAR(100),
  neighbourhood VARCHAR(100),
  latitude DECIMAL,
  longitude DECIMAL,
  room_type VARCHAR(50),
  price DECIMAL,
  minimum_nights INT,
  number_of_reviews INT,
  last_review DATE,
  reviews_per_month DECIMAL,
  calculated_host_listings_count INT,
  availability_365 INT,
  number_of_reviews_ltm INT,
  license VARCHAR(50)
);

COPY properties(name, host_id, host_name, neighbourhood_group, neighbourhood, latitude, longitude, room_type, price, minimum_nights, number_of_reviews, last_review, reviews_per_month, calculated_host_listings_count, availability_365, number_of_reviews_ltm, license)
FROM '/docker-entrypoint-initdb.d/data/airbnb_listings.csv' 
DELIMITER ',' 
CSV HEADER;