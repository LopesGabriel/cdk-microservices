import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { IProductRepository } from "../repositories/IProductRepository";

class GetProductById {
  constructor(private repo: IProductRepository){}

  handle(pathParams: APIGatewayProxyEventPathParameters) {
    const { id } = pathParams;

    if (id === undefined) throw new Error("Path value for id is undefined");

    return this.repo.get(id);
  }
}

export { GetProductById };
