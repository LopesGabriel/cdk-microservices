import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, EventBridgeEvent, EventBridgeHandler, Handler } from "aws-lambda";
import { IEventDetail } from "./models/IEventDetail";
import { DynamoOrderingRepository } from "./repositories/implementations/DynamoOrderingRepository";
import { CreateOrderUseCase } from "./useCases/CreateOrderUseCase";
import { GetOrderUseCase } from "./useCases/GetOrderUseCase";
import { GetAllOrdersUseCase } from "./useCases/GetAllOrdersUseCase";

type IEvent = EventBridgeEvent<'CheckoutBasket', IEventDetail>;
type IAPIEvent = APIGatewayProxyEvent;
interface ICustomEvent extends IEvent, IAPIEvent {};
type ICustomHandler = Handler<ICustomEvent, APIGatewayProxyResult | void>;

const orderRepository = new DynamoOrderingRepository()
const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const getOrderUseCase = new GetOrderUseCase(orderRepository);
const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);

const eventBridgeHandler: EventBridgeHandler<'CheckoutBasket', IEventDetail, any> = async (event) => {
  return await createOrderUseCase.handle(event.detail)
}

const apiGatewayHandler: APIGatewayProxyHandler = async (event) => {
  let body;

  try {
    if (event.pathParameters !== null) {
      body = await getOrderUseCase.handle(event);
    } else {
      body = await getAllOrdersUseCase.handle();
    }

    return {
      body: JSON.stringify(body),
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  } catch (err: any) {
    console.error(err);

    return {
      body: `
      <h1>Internal server error</h1></br>
      <pre>${err.message}\n${err.stack}</pre>
      `,
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html'
      }
    }
  }

}

const handler: ICustomHandler = async (event, ctx, callback) => {
  if (event["detail-type"]) {
    return eventBridgeHandler(event, ctx, callback);
  }

  return apiGatewayHandler(event, ctx, callback);
}

export { handler }
