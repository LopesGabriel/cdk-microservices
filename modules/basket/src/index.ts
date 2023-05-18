import { APIGatewayProxyHandler } from 'aws-lambda'
import { BasketDynamoRepository } from './repositories/implementation/BasketDynamoRepository'
import { GetBasketUseCase } from './useCases/GetBasketUseCase'
import { ListBasketUseCase } from './useCases/ListBasketUseCase';
import { CreateBasketUseCase } from './useCases/CreateBasketUseCase';
import { CheckoutBasketUseCase } from './useCases/CheckoutBasketUseCase';
import { DeleteBasketUseCase } from './useCases/DeleteBasketUseCase';

const basketRepo = new BasketDynamoRepository();
const createBasketUseCase = new CreateBasketUseCase(basketRepo);
const getBasketUseCase = new GetBasketUseCase(basketRepo);
const listBasketUseCase = new ListBasketUseCase(basketRepo);
const checkoutUseCase = new CheckoutBasketUseCase(basketRepo);
const deleteBasketUseCase = new DeleteBasketUseCase(basketRepo);

const handler: APIGatewayProxyHandler = async (event, _context) => {
  let body;
  let statusCode = 200;

  switch (event.httpMethod) {
    case "GET":
      if (event.pathParameters != null) {
        body = await getBasketUseCase.handle(event);
      } else {
        body = await listBasketUseCase.handle();
      }
    case "POST":
      if (event.path.includes("checkout")) {
        body = await checkoutUseCase.handle(event);
      } else {
        body = await createBasketUseCase.handle(event);
        statusCode = 201;
      }
    case "DELETE":
      body = await deleteBasketUseCase.handle(event);
  }

  console.debug(JSON.stringify(body, null, 2));

  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode
  }
}

export { handler }
