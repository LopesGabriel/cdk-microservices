import z from 'zod';
import { v4 } from 'uuid';
import { IProductRepository } from "../repositories/IProductRepository";

class CreateProductUseCase {
  constructor(private repo: IProductRepository){}

  handle(body: string) {
    const bodySchema = z.object({
      ProductName: z.string(),
      ProductDescription: z.string().optional(),
      ProductPrice: z.number(),
    });

    const {
      ProductName,
      ProductPrice,
      ProductDescription
    } = bodySchema.parse(JSON.parse(body));
    const id = v4();

    return this.repo.create({
      id, ProductName, ProductPrice, ProductDescription
    });
  }
}

export { CreateProductUseCase };
