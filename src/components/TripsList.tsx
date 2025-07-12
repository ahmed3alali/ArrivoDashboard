import { useEffect, useState } from 'react';
import { Edit, Trash2, MapPin, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { Trip } from '../types/Trip';
import { t } from 'i18next';

interface TripsListProps {
  trips: { node: Trip }[];
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const TripsList = ({ trips, onEditTrip, onDeleteTrip }: TripsListProps) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendMediaUrl = import.meta.env.VITE_BACKEND_URL_MEDIA;



  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    console.log('Fetched trips:', trips);
  }, [trips]);

  // Secure input handler: trims input and limits length
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Limit input length to 100
    if (value.length > 100) {
      value = value.slice(0, 100);
    }
  
    // Allow English, Turkish, Arabic letters, numbers, spaces, commas, dots, and dashes
    const allowedPattern = /^[a-zA-Z0-9 çÇğĞıİöÖşŞüÜ\u0600-\u06FF.,-]*$/;
  
    if (!allowedPattern.test(value)) {
      value = value.replace(/[^a-zA-Z0-9 çÇğĞıİöÖşŞüÜ\u0600-\u06FF.,-]/g, '');
    }
  
    setSearchTerm(value.trimStart());
  };
  
  
  // Filter trips by search term (case-insensitive)
  const filteredTrips = trips.filter(({ node }) =>
    node.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t("TripManagement")}</h1>
          <p className="text-gray-600 mt-1">{t("ManageTripsDescription")}</p>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder={t("Search")}
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100} // also limit in HTML input element
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(({ node: trip }) => (
          <div
            key={trip.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="relative">
              {trip.cardThumbnail && (
                <img
                src={`${backendMediaUrl}/${trip.cardThumbnail}`}
                  alt={trip.cardThumbnail}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {trip.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                  ${trip.price}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{trip.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 rtl:ml-2 text-blue-500" />
                  {trip.provinces?.[0]?.name}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 rtl:ml-2 text-green-500" />
                  {trip.durationHours}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 rtl:ml-2 text-purple-500" />
                  {trip.groupSize}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-lg font-bold text-gray-800">
                  <DollarSign className="w-5 h-5 mr-1 text-green-500" />
                  {trip.price}
                </div>

                <div className="flex items-center space-x-2 rtl:gap-2">
                  <button
                    onClick={() => onEditTrip(trip)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    aria-label={`Edit ${trip.title}`}
                  >
                    <Edit className="w-4 h-4 " />
                  </button>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    aria-label={`Delete ${trip.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
