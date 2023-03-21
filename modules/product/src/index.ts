import { APIGatewayProxyHandler } from "aws-lambda";
import { ProductRepository } from "./repositories/implementation/ProductRepository";
import { CreateProductUseCase } from "./useCases/CreateProduct";
import { GetAllProductsUseCase } from "./useCases/GetAllProducts";
import { GetProductByIdUseCase } from "./useCases/GetProductById";

const productRepo = new ProductRepository();

const getProductByIdUseCase = new GetProductByIdUseCase(productRepo);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepo);
const createProductUseCase = new CreateProductUseCase(productRepo);

const handler: APIGatewayProxyHandler = async (event) => {
  console.log("request", JSON.stringify(event, null, 2));
  const { body, httpMethod, pathParameters } = event;

  switch (httpMethod) {
    case "GET":
      if (pathParameters !== null) {
        return {
          statusCode: 200,
          body: JSON.stringify(await getProductByIdUseCase.handle(pathParameters))
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify(await getAllProductsUseCase.handle())
      }
    case "POST":
      if (!body) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Request body is required"
          })
        }
      }

      return {
        statusCode: 201,
        body: JSON.stringify(await createProductUseCase.handle(body))
      }
    default:
      console.error(`${httpMethod} not supported`, JSON.stringify(event, null, 2));
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      }
  }
}

export { handler }
