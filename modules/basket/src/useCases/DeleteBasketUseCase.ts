import { APIGatewayProxyEvent } from "aws-lambda";
import { IBasketRepository } from "../repositories/IBasketRepository";
import { z } from "zod";

class DeleteBasketUseCase {
  private repo: IBasketRepository;

  constructor(repo: IBasketRepository) {
    this.repo = repo;
  }

  public async handle(event: APIGatewayProxyEvent) {
    const schema = z.object({
      userName: z.string()
    });

    const { userName } = schema.parse(event.pathParameters);

    await this.repo.delete(userName);

    return { message: `Basket for ${userName} was deleted` };
  }
}

export { DeleteBasketUseCase }
