import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { IProductRepository } from "../repositories/IProductRepository";

class DeleteProductUseCase {
  constructor(private repo: IProductRepository){}

  async handle(pathParameters: APIGatewayProxyEventPathParameters) {
    const { id } = pathParameters;

    const product = await this.repo.get(id!);

    await this.repo.delete(id!);
    return {
      message: `Product ${product.ProductName} deleted`
    }
  }
}

export { DeleteProductUseCase };
