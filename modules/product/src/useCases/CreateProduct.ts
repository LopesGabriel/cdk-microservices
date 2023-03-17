import { IProductRepository } from "../repositories/IProductRepository";

class CreateProduct {
  constructor(private repo: IProductRepository){}

  handle() {
    
  }
}

export { CreateProduct };
