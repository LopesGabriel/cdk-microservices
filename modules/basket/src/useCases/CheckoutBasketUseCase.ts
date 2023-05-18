import { APIGatewayProxyEvent } from "aws-lambda";
import { IBasketRepository } from "../repositories/IBasketRepository"

class CheckoutBasketUseCase {
  private repo: IBasketRepository;

  constructor(repo: IBasketRepository) {
    this.repo = repo;
  }

  public async handle(event: APIGatewayProxyEvent) {
    
  }
}

export { CheckoutBasketUseCase }
