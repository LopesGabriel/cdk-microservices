import { APIGatewayProxyEvent } from "aws-lambda";
import { IBasketRepository } from "../repositories/IBasketRepository"
import { z } from "zod";

class CreateBasketUseCase {
  private repo: IBasketRepository;

  constructor(repo: IBasketRepository) {
    this.repo = repo;
  }

  public async handle(event: APIGatewayProxyEvent) {
    const schema = z.object({
      userName: z.string(),
      items: z.array(z.object({
        quantity: z.number(),
        color: z.string(),
        price: z.number(),
        productId: z.string(),
        productName: z.string(),
      }))
    });

    const {
      userName, items
    } = schema.parse(event);

    const basket = await this.repo.create({
      userName,
      items
    });
    if (!basket) throw new Error('Could not create basket');

    return basket;
  }
}

export { CreateBasketUseCase }
