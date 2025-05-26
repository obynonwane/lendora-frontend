export type Category_TYPE = {
  id: string;
  name: string;
  description: string;
  icon_class: string;
  created_at_human: string;
  updated_at_human: string;
};

export type SubCategory_TYPE = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  icon_class: string;
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
