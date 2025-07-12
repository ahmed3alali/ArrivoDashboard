import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Save, X, Upload } from 'lucide-react';
import { CREATE_ONE_DAY_TRIP, EDIT_ONE_DAY_TRIP } from "../graphql/mutations/mutations"

export interface Trip {
  id?: string; // Optional because new trips don't have an ID
  title: string;
  destination: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  category: string;
  maxGuests: number;
  startDate: string;
  endDate: string;
}


interface TripFormProps {
  trip?: Trip | null;
  onSubmit: (trip: Trip | Omit<Trip, 'id'>) => void;
  onCancel: () => void;
}

export const TripForm = ({ trip, onSubmit, onCancel }: TripFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    duration: '',
    price: 0,
    description: '',
    image: '',
    category: 'Adventure',
    maxGuests: 1,
    startDate: '',
    endDate: ''
  });

  // Apollo mutation hooks
  const [createOneDayTrip] = useMutation(CREATE_ONE_DAY_TRIP);
  const [editOneDayTrip] = useMutation(EDIT_ONE_DAY_TRIP);

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title,
        destination: trip.destination,
        duration: trip.duration,
        price: trip.price,
        description: trip.description,
        image: trip.image,
        category: trip.category,
        maxGuests: trip.maxGuests,
        startDate: trip.startDate,
        endDate: trip.endDate
      });
    }
  }, [trip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (trip) {
      // For editing a trip
      await editOneDayTrip({
        variables: {
          id: trip.id, // Assuming `trip.id` is available
          ...formData
        }
      });
    } else {
      // For creating a new trip
      await createOneDayTrip({
        variables: {
          ...formData
        }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxGuests' ? Number(value) : value
    }));
  };

  const categories = ['Adventure', 'Cultural', 'Wildlife', 'Beach', 'City', 'Mountain', 'Desert'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {trip ? 'Edit Trip' : 'Add New Trip'}
            </h1>
            <p className="text-gray-600 mt-1">
              {trip ? 'Update trip information' : 'Create a new travel package'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* The form fields remain the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Other form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter trip title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter destination"
              />
            </div>

            {/* More fields like duration, price, etc. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
            </div>

            {/* Other fields */}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{trip ? 'Update Trip' : 'Create Trip'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
