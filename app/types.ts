export type SubCategory_TYPE = {
  id: string;
  name: string;
  description: string;
  subcategory_slug: string;
  icon_class: string;
  created_at_human: string;
  updated_at_human: string;
};

export type Category_TYPE = {
  id: string;
  name: string;
  description: string;
  icon_class: string;
  category_slug: string;
  subcategories: SubCategory_TYPE[];
  created_at_human: string;
  updated_at_human: string;
};

export type State_TYPE = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};
export type LGA_TYPE = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

//

export interface Timestamp {
  seconds: number;
  nanos: number;
}

export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
}

export interface LGA {
  id: string;
  name: string;
}

export interface InventoryImage {
  id: string;
  live_url: string;
  local_url: string;
  inventory_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  user_id: string;
  category_id: string;
  subcategory_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  country_id: string;
  state_id: string;
  lga_id: string;
  country: Country;
  state: State;
  lga: LGA;
  images: InventoryImage[];
  user: User;
  created_at_human: string;
  updated_at_human: string;
  offer_price: string;
  slug: string;
}
