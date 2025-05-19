import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RVProfile {
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
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isAddingRV, setIsAddingRV] = useState(false);
  const [newRV, setNewRV] = useState<Partial<RVProfile>>({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    is_current: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setDisplayName(data.display_name || '');
          setBio(data.bio || '');
        } else {
          setError('Failed to fetch profile');
          if (response.status === 401) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
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
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/users/me/rvs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRV)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
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
        setSaveError('Failed to add RV');
      }
    } catch (error) {
      console.error('Error adding RV:', error);
      setSaveError('Failed to add RV');
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>RV Owner Profile</h2>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        {isEditing ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Display Name</h3>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name (e.g., 'John & Jane' or 'The Smith Family')"
                style={{ 
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Bio</h3>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your RV adventures..."
                style={{ 
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleSaveProfile}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
            {saveError && <p style={{ color: 'red', marginTop: '10px' }}>{saveError}</p>}
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Display Name</h3>
              <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                {profile.display_name || 'No display name set'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Bio</h3>
              <p style={{ 
                whiteSpace: 'pre-wrap',
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {profile.bio || 'No bio added yet. Click Edit Profile to add your story!'}
              </p>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Edit Profile
            </button>
          </div>
        )}

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>My RVs</h3>
            <button
              onClick={() => setIsAddingRV(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add New RV
            </button>
          </div>

          {isAddingRV && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginBottom: '15px' }}>Add New RV</h4>
              <div style={{ display: 'grid', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="RV Name (e.g., 'Big Bertha' or 'The Adventure Mobile')"
                  value={newRV.name}
                  onChange={(e) => setNewRV({ ...newRV, name: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Make"
                    value={newRV.make}
                    onChange={(e) => setNewRV({ ...newRV, make: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={newRV.model}
                    onChange={(e) => setNewRV({ ...newRV, model: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <input
                  type="number"
                  placeholder="Year"
                  value={newRV.year}
                  onChange={(e) => setNewRV({ ...newRV, year: parseInt(e.target.value) })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <textarea
                  placeholder="Description (e.g., features, modifications, favorite things about this RV)"
                  value={newRV.description}
                  onChange={(e) => setNewRV({ ...newRV, description: e.target.value })}
                  style={{ 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleAddRV}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
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
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gap: '20px' }}>
            {profile.rvs?.map((rv) => (
              <div 
                key={rv.id}
                style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>{rv.name}</h4>
                    <p style={{ margin: '0 0 5px 0' }}>
                      {rv.year} {rv.make} {rv.model}
                    </p>
                    {rv.is_current && (
                      <span style={{ 
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8em'
                      }}>
                        Current RV
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {/* TODO: Implement edit RV */}}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </div>
                {rv.description && (
                  <p style={{ 
                    marginTop: '10px',
                    color: '#666'
                  }}>
                    {rv.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <h3 style={{ marginBottom: '10px' }}>Account Information</h3>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 