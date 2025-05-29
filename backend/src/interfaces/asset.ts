export interface Asset {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AssetPublic {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface AssetCreateData {
  name: string;
  description?: string;
}

export interface AssetUpdateData {
  name?: string;
  description?: string;
}