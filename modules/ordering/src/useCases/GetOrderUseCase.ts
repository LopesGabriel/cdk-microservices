import { APIGatewayProxyEvent } from "aws-lambda";
import { IOrderingRepository } from "../repositories/IOrderingRepository";
import { z } from "zod";

export class GetOrderUseCase {
  private readonly repo: IOrderingRepository;

  constructor(repo: IOrderingRepository) {
    this.repo = repo;
  }

  public async handle(event: APIGatewayProxyEvent) {
    const reqSchema = z.object({
      userName: z.string(),
      orderDate: z.string(),
    })

    const { orderDate, userName } = reqSchema.parse({ ...event.pathParameters, ...event.queryStringParameters });

    return this.repo.getByUsernameAndOrderDate(userName, orderDate);
  }
}