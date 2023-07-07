import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, EventBridgeEvent, EventBridgeHandler, Handler } from "aws-lambda";
import { IEventDetail } from "./models/IEventDetail";
import { DynamoOrderingRepository } from "./repositories/implementations/DynamoOrderingRepository";
import { CreateOrderUseCase } from "./useCases/CreateOrderUseCase";

type IEvent = EventBridgeEvent<'CheckoutBasket', IEventDetail>;
type IAPIEvent = APIGatewayProxyEvent;
interface ICustomEvent extends IEvent, IAPIEvent {};
type ICustomHandler = Handler<ICustomEvent, APIGatewayProxyResult | void>;

const orderRepository = new DynamoOrderingRepository()
const createOrderUseCase = new CreateOrderUseCase(orderRepository);

const eventBridgeHandler: EventBridgeHandler<'CheckoutBasket', IEventDetail, any> = async (event) => {
  return await createOrderUseCase.handle(event.detail)
}

const apiGatewayHandler: APIGatewayProxyHandler = async (event) => {
  return {
    body: 'Hello, world',
    statusCode: 200
  }
}

const handler: ICustomHandler = async (event, ctx, callback) => {
  if (event["detail-type"]) {
    return eventBridgeHandler(event, ctx, callback);
  }

  return apiGatewayHandler(event, ctx, callback);
}

export { handler }
