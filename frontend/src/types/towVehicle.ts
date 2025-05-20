export interface TowVehicle {
  id: number;
  user_id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  description?: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTowVehicleData {
  name: string;
  make: string;
  model: string;
  year: number;
  description?: string;
  is_current?: boolean;
}

export interface UpdateTowVehicleData extends Partial<CreateTowVehicleData> {} 