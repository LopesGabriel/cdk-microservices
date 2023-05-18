import { APIGatewayProxyEvent } from "aws-lambda";
import { IBasketRepository } from "../repositories/IBasketRepository";
import { z } from "zod";

class GetBasketUseCase {
  private repo: IBasketRepository;

  constructor(repo: IBasketRepository) {
    this.repo = repo;
  }

  public async handle(event: APIGatewayProxyEvent) {
    const schema = z.object({
      userName: z.string()
    })

    const { userName } = schema.parse(event.pathParameters);

    const basket = await this.repo.get(userName);
    if (!basket) throw new Error('Basket not found');

    return basket;
  }
}

export { GetBasketUseCase }