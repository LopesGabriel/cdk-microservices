import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { z } from "zod";

import { IProductRepository } from "../repositories/IProductRepository";

interface IUpdateProductArgs {
  body: string,
  pathParameters: APIGatewayProxyEventPathParameters
}

class UpdateProductUseCase {
  constructor(private repo: IProductRepository){}

  async handle({ body, pathParameters }: IUpdateProductArgs) {
    const requestSchema = z.object({
      ProductName: z.string().optional(),
      ProductDescription: z.string().optional(),
      ProductPrice: z.number().optional(),
      id: z.string()
    });

    const {
      id,
      ProductDescription,
      ProductName,
      ProductPrice
    } = requestSchema.parse({ ...pathParameters, ...JSON.parse(body) })

    return await this.repo.update({ id, ProductDescription, ProductName, ProductPrice });
  }
}

export { UpdateProductUseCase };
