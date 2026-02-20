export interface IExample {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface IExampleCreate {
  name: string;
  email: string;
  phone: string;
  document: string;
  status: 'active' | 'inactive';
}

export interface IExampleUpdate extends Partial<IExampleCreate> {}
