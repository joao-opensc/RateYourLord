from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        user=os.getenv("DB_USER"),
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT"),
    )
    return conn

class Property(BaseModel):
    id: int
    name: str
    host_id: int
    host_name: str
    neighbourhood_group: str
    neighbourhood: str
    latitude: float
    longitude: float
    room_type: str
    price: float
    minimum_nights: int
    number_of_reviews: int
    last_review: str
    reviews_per_month: float
    calculated_host_listings_count: int
    availability_365: int
    number_of_reviews_ltm: int
    license: str

@app.get("/search")
async def search_properties(city: str = None):
    print(f"Received request for city: {city}")  # Log the request
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if city:
            cursor.execute('SELECT * FROM properties WHERE city = %s', (city,))
        else:
            cursor.execute('SELECT * FROM properties')
        
        # Fetch all properties
        properties = cursor.fetchall()
        
        # Convert to list of dictionaries
        property_list = []
        for property in properties:
            property_dict = {
                "id": property[0],
                "name": property[1],
                "host_id": property[2],
                "host_name": property[3],
                "neighbourhood_group": property[4],
                "neighbourhood": property[5],
                "latitude": property[6],
                "longitude": property[7],
                "room_type": property[8],
                "price": property[9],
                "minimum_nights": property[10],
                "number_of_reviews": property[11],
                "last_review": property[12],
                "reviews_per_month": property[13],
                "calculated_host_listings_count": property[14],
                "availability_365": property[15],
                "number_of_reviews_ltm": property[16],
                "license": property[17],
            }
            property_list.append(property_dict)

        return property_list  # Return the list of dictionaries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Property Search API"}