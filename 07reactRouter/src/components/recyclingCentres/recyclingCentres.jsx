import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../ImageUpload/ImageUpload.jsx";

const locationsData = {
  "Delhi": [
    { name: "Green E-Waste Recyclers", address: "vasant kunj", id: 1 },
    { name: "RecycleIT Center", address: "palika bazar", id: 2 },
  ],
  "Mumbai": [
    { name: "SF E-Waste Solutions", address: "789 Green Blvd, SF", id: 3 },
    { name: "Bay Area Recyclers", address: "101 Eco Lane, SF", id: 4 },
  ],
  "Mysore": [
          { name: "SF E-Waste Solutions", address: "789 Green Blvd, SF", id: 3 },
          { name: "Bay Area Recyclers", address: "101 Eco Lane, SF", id: 4 },
        ],
  "Meerut": [
          { name: "SF E-Waste Solutions", address: "789 Green Blvd, SF", id: 3 },
          { name: "Bay Area Recyclers", address: "101 Eco Lane, SF", id: 4 },
        ],
  "Moradabad": [
          { name: "SF E-Waste Solutions", address: "789 Green Blvd, SF", id: 3 },
          { name: "Bay Area Recyclers", address: "101 Eco Lane, SF", id: 4 },
        ],
  "Chennai": [
    { name: "Chi Recycle Hub", address: "202 Eco Park, Chicago", id: 5 },
    { name: "Windy City E-Waste", address: "303 Green Cir, Chicago", id: 6 },
  ],
  "Chittorgarh": [
    { name: "Chi Recycle Hub", address: "202 Eco Park, Chicago", id: 5 },
    { name: "Windy City E-Waste", address: "303 Green Cir, Chicago", id: 6 },
  ],
  "Noida": [

          
    { name: "Chi Recycle Hub", address: "202 Eco Park, Chicago", id: 5 },
    { name: "Windy City E-Waste", address: "303 Green Cir, Chicago", id: 6 },
  ],
  "Dehradun": [
    { name: "Green E-Waste Recyclers", address: "vasant kunj", id: 1 },
    { name: "RecycleIT Center", address: "palika bazar", id: 2 },
  ],
  "Dalhousie": [
    { name: "Green E-Waste Recyclers", address: "vasant kunj", id: 1 },
    { name: "RecycleIT Center", address: "palika bazar", id: 2 },
  ],
};

const RecyclingCenters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [recyclingCenters, setRecyclingCenters] = useState([]);
  const navigate = useNavigate(); 

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setRecyclingCenters(locationsData[location]);
    setSearchTerm(""); 
  };

  const filteredLocations = Object.keys(locationsData).filter((location) =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCenterClick = (centerId) => {
    navigate("/ImageUpload", { state: { centerId } });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">E-Waste Recycling Centers</h1>

      <input
        type="text"
        placeholder="Enter your location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {searchTerm && (
        <ul className="bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto">
          {filteredLocations.map((location) => (
            <li
              key={location}
              onClick={() => handleLocationSelect(location)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {location}
            </li>
          ))}
        </ul>
      )}

      {selectedLocation && (
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">
            Recycling Centers in {selectedLocation}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recyclingCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => handleCenterClick(center.id)} 
                className="p-6 border border-gray-300 rounded-md shadow-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <h3 className="text-xl font-bold">{center.name}</h3>
                <p className="mt-2 text-gray-700">{center.address}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclingCenters;
