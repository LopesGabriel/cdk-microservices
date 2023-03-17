import { IProductRepository } from "../repositories/IProductRepository";

class GetAllProductsUseCase {
  constructor(private repo: IProductRepository) {}

  handle() {
    return this.repo.list();
  }
}

export { GetAllProductsUseCase };