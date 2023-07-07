interface IOrderingRepository {
  create: (order: any) => Promise<any>;
}

export { IOrderingRepository }
