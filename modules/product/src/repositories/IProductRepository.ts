interface IProductRepository {
  create: (data: any) => Promise<any>;
  get: (productId: string) => Promise<Record<string, any>>;
  list: () => Promise<Record<string, any>[]>;
  update: (data: IUpdateProductArgs) => Promise<any>;
  delete: (productId: string) => Promise<void>;
}

interface IUpdateProductArgs {
  id: string
  ProductDescription?: string
  ProductName?: string
  ProductPrice?: number
}

export { IProductRepository, IUpdateProductArgs };
