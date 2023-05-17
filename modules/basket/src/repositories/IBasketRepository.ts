interface IBasketRepository {
  create: (data: any) => Promise<any>;
  get: (userName: string) => Promise<any>;
  list: () => Promise<any[]>;
  update: (data: any) => Promise<any>;
  delete: (useName: string) => Promise<void>
}

export { IBasketRepository }
