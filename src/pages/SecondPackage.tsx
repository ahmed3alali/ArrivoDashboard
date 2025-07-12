import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Calendar, Users, DollarSign, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { gql, useApolloClient } from '@apollo/client';
// Apollo Client setup (you'll need to configure this with your GraphQL endpoint)
const GRAPHQL_ENDPOINT = 'YOUR_GRAPHQL_ENDPOINT_HERE';

// GraphQL Operations
const CREATE_TRIP_PACKAGE = gql`
  mutation CreateTripPackage(
    $tripId: ID!
    $price: String!
    $groupSize: String!
    $startDate: Date!
    $endDate: Date!
  ) {
    createTripPackage(
      tripId: $tripId
      price: $price
      groupSize: $groupSize
      startDate: $startDate
      endDate: $endDate
    ) {
      tripPackage {
        id
        price
        groupSize
        startDate
        endDate
      }
    }
  }
`;

const EDIT_TRIP_PACKAGE = gql`
  mutation EditTripPackage(
    $id: ID!
    $price: String
    $groupSize: String
    $startDate: Date
    $endDate: Date
  ) {
    editTripPackage(
      id: $id
      price: $price
      groupSize: $groupSize
      startDate: $startDate
      endDate: $endDate
    ) {
      tripPackage {
        id
        price
        groupSize
        startDate
        endDate
      }
    }
  }
`;

const DELETE_TRIP_PACKAGE = gql`
  mutation DeleteTripPackage($id: ID!) {
    deleteTripPackage(id: $id) {
      tripPackageId
    }
  }
`;

const LIST_TRIPS = gql`
  query ListTrips(
    $first: Int
    $after: String
    $country: String
    $groupSize: String
    $tags: [String]
    $duration: String
    $tripType: String
    $subType: String
    $price: String
    $fromDate: Date
    $toDate: Date
    $lengthType: TripLengthTypeEnum
  ) {
    trips(
      first: $first
      after: $after
      country: $country
      groupSize: $groupSize
      tags: $tags
      duration: $duration
      tripType: $tripType
      subType: $subType
      price: $price
      fromDate: $fromDate
      toDate: $toDate
      lengthType: $lengthType
    ) {
      edges {
        node {
          __typename
          ... on OneDayTripNode {
            id
            title
            description
            tripType
            durationHours
            lengthType
            price
            groupSize
            thumbnail
            cardThumbnail
          }
          ... on MultiDayTripNode {
            id
            title
            description
            tripType
            durationHours
            lengthType
            price
            groupSize
            cardThumbnail
            thumbnails {
              edges {
                node {
                  id
                  image
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

const GET_TRIP_PACKAGES = gql`
  query GetTripPackages($tripId: ID) {
    tripPackages(trip_Id: $tripId) {
      edges {
        node {
          id
          price
          groupSize
          startDate
          endDate
          trip {
            id
            title
          }
        }
      }
    }
  }
`;

// GraphQL client function
const graphqlClient = async (query, variables = {}) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your authentication headers here if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    return data.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

const TripPackageCRUD = () => {
    const client = useApolloClient();
  const [packages, setPackages] = useState([]);
  const [trips, setTrips] = useState([]);
  const [existingPackages, setExistingPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTripId, setSelectedTripId] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    country: '',
    groupSize: '',
    tripType: '',
    price: '',
    lengthType: ''
  });

  // Fetch existing packages
  const fetchTripPackages = async (tripId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const variables = tripId ? { tripId } : {};
      const { data } = await client.query({
        query: GET_TRIP_PACKAGES,
        variables,
        fetchPolicy: 'network-only',
      });
      const packageEdges = data.tripPackages.edges || [];
      setExistingPackages(packageEdges.map(edge => edge.node));
    } catch (err) {
      setError('Failed to fetch trip packages: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trips
  const fetchTrips = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const variables = {
        first: 50,
        ...filters
      };
      
      const { data } = await client.query({
        query: LIST_TRIPS,
        variables,
        fetchPolicy: 'network-only' // optional, to always fetch fresh data
      });
      const tripEdges = data.trips.edges || [];
      setTrips(tripEdges.map(edge => edge.node));
    } catch (err) {
      setError('Failed to fetch trips: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create package
  const createPackage = async (packageData) => {
    setLoading(true);
    setError(null);
    
    try {
        const { data } = await client.mutate({
            mutation: CREATE_TRIP_PACKAGE,
            variables: packageData,
          });
      const newPackage = data.createTripPackage.tripPackage;
      
      // Add trip details to the package
      const trip = trips.find(t => t.id === packageData.tripId);
      const packageWithTrip = { ...newPackage, trip };
      
      setPackages(prev => [...prev, packageWithTrip]);
      setExistingPackages(prev => [...prev, newPackage]);
      setIsCreateModalOpen(false);
      
      // Refresh packages if we're filtering by trip
      if (selectedTripId) {
        fetchTripPackages(selectedTripId);
      }
    } catch (err) {
      setError('Failed to create package: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit package
  const editPackage = async (id, packageData) => {
    setLoading(true);
    setError(null);
    
    try {


        const { data } = await client.mutate({
            mutation: EDIT_TRIP_PACKAGE,
            variables: { id, ...packageData },
          });


      const updatedPackage = data.editTripPackage.tripPackage;
      
      setPackages(prev => 
        prev.map(pkg => 
          pkg.id === id 
            ? { ...pkg, ...updatedPackage }
            : pkg
        )
      );
      setExistingPackages(prev => 
        prev.map(pkg => 
          pkg.id === id 
            ? { ...pkg, ...updatedPackage }
            : pkg
        )
      );
      setIsEditModalOpen(false);
      setEditingPackage(null);
    } catch (err) {
      setError('Failed to edit package: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const deletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    setLoading(true);
    setError(null);
    
    try {

        await client.mutate({
            mutation: DELETE_TRIP_PACKAGE,
            variables: { id },
          });
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      setExistingPackages(prev => prev.filter(pkg => pkg.id !== id));
    } catch (err) {
      setError('Failed to delete package: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  React.useEffect(() => {
    fetchTrips();
    fetchTripPackages();
  }, []);

  // Filter trips based on search and filters
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filterOptions.tripType || trip.tripType === filterOptions.tripType) &&
      (!filterOptions.lengthType || trip.lengthType === filterOptions.lengthType) &&
      (!filterOptions.groupSize || trip.groupSize === filterOptions.groupSize) &&
      (!filterOptions.price || trip.price === filterOptions.price);
    
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip Package Manager</h1>
          <p className="text-gray-600">Create and manage trip packages for your adventures</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterOptions.tripType}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, tripType: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Cultural">Cultural</option>
                <option value="Adventure">Adventure</option>
                <option value="Culinary">Culinary</option>
                <option value="Nature">Nature</option>
              </select>
              <select
                value={filterOptions.lengthType}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, lengthType: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Lengths</option>
                <option value="ONE_DAY">One Day</option>
                <option value="MULTI_DAY">Multi Day</option>
              </select>
              <button
                onClick={() => fetchTrips(filterOptions)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Existing Trip Packages Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Available Trip Packages</h2>
            <div className="flex gap-2">
              <select
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  fetchTripPackages(e.target.value || null);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Trips</option>
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>{trip.title}</option>
                ))}
              </select>
              <button
                onClick={() => fetchTripPackages(selectedTripId || null)}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Refresh
              </button>
            </div>
          </div>

          {existingPackages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {selectedTripId ? 'No packages found for the selected trip.' : 'No packages available yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pkg.trip?.title || 'Unknown Trip'}
                      </h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{pkg.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{pkg.groupSize} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>{pkg.startDate} - {pkg.endDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPackage(pkg);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Created Packages Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">My Created Packages ({packages.length})</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Create Package
            </button>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No packages created in this session yet. Start by creating your first package!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">
                  {pkg.trip?.cardThumbnail && (
                    <img 
                      src={pkg.trip.cardThumbnail} 
                      alt={pkg.trip.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pkg.trip?.title || 'Unknown Trip'}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {pkg.trip?.description || 'No description available'}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{pkg.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{pkg.groupSize} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{pkg.startDate} - {pkg.endDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPackage(pkg);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Trips */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Trips ({filteredTrips.length})</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading trips...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  {trip.cardThumbnail && (
                    <img 
                      src={trip.cardThumbnail} 
                      alt={trip.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {trip.lengthType === 'ONE_DAY' ? '1 Day' : 'Multi-Day'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{trip.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.tripType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{trip.groupSize}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPackage({ tripId: trip.id, trip });
                        setIsCreateModalOpen(true);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
                    >
                      Create Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Package Modal */}
        <PackageModal
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setEditingPackage(null);
          }}
          onSubmit={isEditModalOpen ? editPackage : createPackage}
          editingPackage={editingPackage}
          trips={trips}
          isEdit={isEditModalOpen}
          loading={loading}
        />
      </div>
    </div>
  );
};

// Package Modal Component
const PackageModal = ({ isOpen, onClose, onSubmit, editingPackage, trips, isEdit, loading }) => {
  const [formData, setFormData] = useState({
    tripId: '',
    price: '',
    groupSize: '',
    startDate: '',
    endDate: ''
  });

  React.useEffect(() => {
    if (editingPackage) {
      setFormData({
        tripId: editingPackage.tripId || '',
        price: editingPackage.price || '',
        groupSize: editingPackage.groupSize || '',
        startDate: editingPackage.startDate || '',
        endDate: editingPackage.endDate || ''
      });
    } else {
      setFormData({
        tripId: '',
        price: '',
        groupSize: '',
        startDate: '',
        endDate: ''
      });
    }
  }, [editingPackage]);

  const handleSubmit = () => {
    if (isEdit) {
      onSubmit(editingPackage.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Edit Package' : 'Create Package'}
          </h2>
          
          <div className="space-y-4">
            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip</label>
                <select
                  value={formData.tripId}
                  onChange={(e) => setFormData(prev => ({ ...prev, tripId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a trip</option>
                  {trips.map(trip => (
                    <option key={trip.id} value={trip.id}>{trip.title}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., $150"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
              <input
                type="text"
                value={formData.groupSize}
                onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                placeholder="e.g., 2-5"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEdit ? 'Update Package' : 'Create Package'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPackageCRUD;