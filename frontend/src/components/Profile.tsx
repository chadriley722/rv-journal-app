import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RVProfile {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  description: string;
  is_current: boolean;
}

interface TowVehicle {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  description: string;
  is_current: boolean;
}

interface UserProfile {
  id: number;
  email: string;
  username: string;
  display_name: string;
  bio: string;
  created_at: string;
  rvs: RVProfile[];
  tow_vehicles: TowVehicle[];
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isAddingRV, setIsAddingRV] = useState(false);
  const [isAddingTowVehicle, setIsAddingTowVehicle] = useState(false);
  const [newRV, setNewRV] = useState<Partial<RVProfile>>({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    is_current: true
  });
  const [newTowVehicle, setNewTowVehicle] = useState<Partial<TowVehicle>>({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    is_current: true
  });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      // Rely on ProtectedRoute for authentication check.
      // if (!isAuthenticated || !token) {
      //   navigate('/login');
      //   return;
      // }

      // We can now assume token is available if we reach here
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) { 
        // This case should ideally not be hit if ProtectedRoute works,
        // but as a fallback, log an error.
        console.error('Profile useEffect: No token found despite being in ProtectedRoute.');
        // Maybe a more graceful error display or re-fetch attempt here instead of navigate.
        return;
      }

      try {
        console.log('Fetching profile with token:', token);
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Profile response status:', response.status);
        const data = await response.json();
        console.log('Profile response data:', data);

        if (response.ok) {
          setProfile(data);
          setDisplayName(data.display_name || '');
          setBio(data.bio || '');
        } else {
          console.error('Profile fetch error:', data);
          setError(`Failed to fetch profile: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
          if (response.status === 401) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(`Failed to fetch profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    fetchProfile();
  }, [navigate, isAuthenticated]);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          display_name: displayName,
          bio: bio
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        setSaveError('');
      } else {
        setSaveError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Failed to update profile');
    }
  };

  const handleAddRV = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch('/api/rvs/me', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRV)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => prev ? {
          ...prev,
          rvs: data.rvs
        } : null);
        setIsAddingRV(false);
        setNewRV({
          name: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          description: '',
          is_current: true
        });
      } else {
        const errorData = await response.json().catch(() => null);
        setSaveError(`Failed to add RV: ${errorData?.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding RV:', error);
      setSaveError(`Failed to add RV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddTowVehicle = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch('/api/tow-vehicles/me', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTowVehicle)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => prev ? {
          ...prev,
          tow_vehicles: data.tow_vehicles
        } : null);
        setIsAddingTowVehicle(false);
        setNewTowVehicle({
          name: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          description: '',
          is_current: true
        });
      } else {
        const errorData = await response.json().catch(() => null);
        setSaveError(`Failed to add tow vehicle: ${errorData?.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding tow vehicle:', error);
      setSaveError(`Failed to add tow vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">RV Owner Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Display Name</h3>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name (e.g., 'John & Jane' or 'The Smith Family')"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Bio</h3>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your RV adventures..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(profile.display_name || '');
                  setBio(profile.bio || '');
                  setSaveError('');
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </div>
            {saveError && <p className="text-red-500 mt-4">{saveError}</p>}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Display Name</h3>
              <p className="text-lg">
                {profile.display_name || 'No display name set'}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Bio</h3>
              <p className="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                {profile.bio || 'No bio added yet. Click Edit Profile to add your story!'}
              </p>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">My RVs</h3>
            <button
              onClick={() => setIsAddingRV(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add New RV
            </button>
          </div>

          {isAddingRV && (
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <h4 className="text-lg font-semibold mb-4">Add New RV</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="RV Name (e.g., 'Big Bertha' or 'The Adventure Mobile')"
                  value={newRV.name}
                  onChange={(e) => setNewRV({ ...newRV, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Make"
                    value={newRV.make}
                    onChange={(e) => setNewRV({ ...newRV, make: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={newRV.model}
                    onChange={(e) => setNewRV({ ...newRV, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Year"
                  value={newRV.year}
                  onChange={(e) => setNewRV({ ...newRV, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (e.g., features, modifications, favorite things about this RV)"
                  value={newRV.description}
                  onChange={(e) => setNewRV({ ...newRV, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleAddRV}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Save RV
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingRV(false);
                      setNewRV({
                        name: '',
                        make: '',
                        model: '',
                        year: new Date().getFullYear(),
                        description: '',
                        is_current: true
                      });
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {profile.rvs?.map((rv) => (
              <div 
                key={rv.id}
                className="bg-white p-6 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{rv.name}</h4>
                    <p className="text-gray-600 mb-2">
                      {rv.year} {rv.make} {rv.model}
                    </p>
                    {rv.is_current && (
                      <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        Current RV
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {/* TODO: Implement edit RV */}}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                </div>
                {rv.description && (
                  <p className="mt-4 text-gray-600">
                    {rv.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">My Tow Vehicles</h3>
            <button
              onClick={() => setIsAddingTowVehicle(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add New Tow Vehicle
            </button>
          </div>

          {isAddingTowVehicle && (
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <h4 className="text-lg font-semibold mb-4">Add New Tow Vehicle</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Vehicle Name (e.g., 'Big Red' or 'The Beast')"
                  value={newTowVehicle.name}
                  onChange={(e) => setNewTowVehicle({ ...newTowVehicle, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Make"
                    value={newTowVehicle.make}
                    onChange={(e) => setNewTowVehicle({ ...newTowVehicle, make: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={newTowVehicle.model}
                    onChange={(e) => setNewTowVehicle({ ...newTowVehicle, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Year"
                  value={newTowVehicle.year}
                  onChange={(e) => setNewTowVehicle({ ...newTowVehicle, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (e.g., features, modifications, towing capacity)"
                  value={newTowVehicle.description}
                  onChange={(e) => setNewTowVehicle({ ...newTowVehicle, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleAddTowVehicle}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Save Vehicle
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingTowVehicle(false);
                      setNewTowVehicle({
                        name: '',
                        make: '',
                        model: '',
                        year: new Date().getFullYear(),
                        description: '',
                        is_current: true
                      });
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {profile?.tow_vehicles?.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="bg-white p-6 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{vehicle.name}</h4>
                    <p className="text-gray-600 mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    {vehicle.is_current && (
                      <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        Current Vehicle
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {/* TODO: Implement edit tow vehicle */}}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                </div>
                {vehicle.description && (
                  <p className="mt-4 text-gray-600">
                    {vehicle.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          <p className="mb-2"><span className="font-semibold">Email:</span> {profile?.email}</p>
          <p><span className="font-semibold">Member since:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 