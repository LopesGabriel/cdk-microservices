interface IProductRepository {
  create: (data: any) => Promise<any>;
  get: (productId: string) => Promise<Record<string, any>>;
  list: () => Promise<Record<string, any>[]>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
}

export { IProductRepository };
