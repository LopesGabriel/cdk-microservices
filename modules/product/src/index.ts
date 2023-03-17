import { APIGatewayProxyHandler } from "aws-lambda";
import { ProductRepository } from "./repositories/implementation/ProductRepository";
// import { CreateProduct } from "./useCases/CreateProduct";
import { GetAllProductsUseCase } from "./useCases/GetAllProducts";
import { GetProductById } from "./useCases/GetProductById";

const productRepo = new ProductRepository();

const getProductByIdUseCase = new GetProductById(productRepo);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepo);
// const createProductUseCase = new CreateProduct(productRepo);

const handler: APIGatewayProxyHandler = async (event) => {
  console.log("request", JSON.stringify(event, null, 2));
  // const { body, httpMethod, pathParameters } = event;
  const { httpMethod, pathParameters } = event;

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
    default:
      console.error(`${httpMethod} not supported`, JSON.stringify(event, null, 2));
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      }
  }
}

export { handler }
