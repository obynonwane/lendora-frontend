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
  primary_image: string;
  category_slug: string;
  id: string;
  name: string;
  description: string;
  user_id: string;
  category_id: string;
  subcategory_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  country_id: string;
  rental_duration: "hourly" | "daily" | "monthly" | "annually";
  state_id: string;
  lga_id: string;
  country: Country;
  quantity: number;
  minimum_price: number;
  security_deposit: number;
  state: State;
  lga: LGA;
  is_available: "yes" | "no";
  negotiable: "yes" | "no";
  product_purpose: "sale" | "rental";
  images: InventoryImage[];
  user: User;
  created_at_human: string;
  updated_at_human: string;
  offer_price: string;
  slug: string;
}

export type UserData_TYPE = {
  access_token: string;
  detail: {
    kyc_detail: {
      business_kyc: {
        address: string;
        business_registered: "yes" | "no";
        cac_number: string;
        created_at: string; // ISO timestamp
        display_name: string;
        id: string;
        updated_at: string; // ISO timestamp
        verified: boolean;
      } | null;
      renter_kyc: {
        address: string;
        image: string;
        created_at: string; // ISO timestamp
        display_name: string;
        id: string;
        updated_at: string; // ISO timestamp
        verified: boolean;
      } | null;
    };
    roles: string[];
    user: {
      accountType: {
        created_at: string;
        id: string;
        name: string;
        updated_at: string;
      };
      created_at: string;
      email: string;
      first_name: string;
      first_time_login: string;
      id: string;
      kycs: null | unknown;
      last_name: string;
      phone: string;
      updated_at: string;
      user_types: null | unknown;
      verified: boolean;
    };
  };
};

export interface ProductPageProduct {
  inventory: InventoryItem;
  user: User;
  category: Category_TYPE;
  subcategory: SubCategory_TYPE;
  images: InventoryImage[];
}
