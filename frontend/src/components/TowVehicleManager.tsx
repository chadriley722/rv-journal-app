import React, { useState, useEffect } from 'react';
import type { TowVehicle, CreateTowVehicleData, UpdateTowVehicleData } from '../types/towVehicle';
import { useAuth } from '../contexts/AuthContext';

const TowVehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<TowVehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateTowVehicleData>({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    is_current: true,
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/tow-vehicles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching tow vehicles:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      description: '',
      is_current: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/tow-vehicles/${editingId}`
        : '/api/tow-vehicles';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchVehicles();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving tow vehicle:', error);
    }
  };

  const handleEdit = (vehicle: TowVehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      name: vehicle.name,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      description: vehicle.description || '',
      is_current: vehicle.is_current,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tow vehicle?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tow-vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchVehicles();
      }
    } catch (error) {
      console.error('Error deleting tow vehicle:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tow Vehicles</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isAdding ? 'Cancel' : 'Add Tow Vehicle'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Make</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                  className="mr-2"
                />
                Current Tow Vehicle
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                <p className="text-gray-600">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.description && (
                  <p className="mt-2 text-gray-700">{vehicle.description}</p>
                )}
                {vehicle.is_current && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Current
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TowVehicleManager; 