interface IOrderingRepository {
  create: (order: any) => Promise<any>;
  getByUsernameAndOrderDate: (userName: string, orderDate: string) => Promise<any>;
  getAllOrders: () => Promise<any>;
}

export { IOrderingRepository }
