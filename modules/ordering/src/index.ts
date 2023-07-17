import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, EventBridgeEvent, EventBridgeHandler, Handler, SQSBatchResponse, SQSEvent, SQSHandler } from "aws-lambda";
import { IEventDetail } from "./models/IEventDetail";
import { DynamoOrderingRepository } from "./repositories/implementations/DynamoOrderingRepository";
import { CreateOrderUseCase } from "./useCases/CreateOrderUseCase";
import { GetOrderUseCase } from "./useCases/GetOrderUseCase";
import { GetAllOrdersUseCase } from "./useCases/GetAllOrdersUseCase";
import { z } from "zod";

type IEvent = EventBridgeEvent<'CheckoutBasket', IEventDetail>;
type IAPIEvent = APIGatewayProxyEvent;
interface ICustomEvent extends IEvent, IAPIEvent, SQSEvent {
};
type ICustomHandler = Handler<ICustomEvent, APIGatewayProxyResult | SQSBatchResponse | void>;

const orderRepository = new DynamoOrderingRepository()
const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const getOrderUseCase = new GetOrderUseCase(orderRepository);
const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);

const sqsHandler: SQSHandler = async (event) => {
  console.info('New SQS message received');

  for (const record of event.Records) {
    console.info('Record:', { id: record.messageId, body: record.body });
    const data = JSON.parse(record.body);
    const { detail } = data

    const orderSchema = z.object({
      userName: z.string(),
      totalPrice: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      address: z.string(),
      cardInfo: z.string(),
      paymentMethod: z.number(),
      items: z.object({
        quantity: z.number(),
        color: z.string(),
        productId: z.string(),
        price: z.number(),
        productName: z.string()
      }).array()
    });

    const order = orderSchema.parse({
      ...detail,
      paymentMethod: Number(detail.paymentMethod)
    });
    await createOrderUseCase.handle(order);
  }
}

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
  if (event.Records) {
    return sqsHandler(event, ctx, callback)
  }

  if (event["detail-type"]) {
    return eventBridgeHandler(event, ctx, callback);
  }

  return apiGatewayHandler(event, ctx, callback);
}

export { handler }
