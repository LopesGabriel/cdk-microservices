import { APIGatewayProxyEvent } from "aws-lambda";
import { IBasketRepository } from "../repositories/IBasketRepository"
import { IEventBridgeRepository } from "../repositories/IEventBridgeRepository";
import { z } from "zod";

class CheckoutBasketUseCase {
  private readonly repo: IBasketRepository;
  private readonly eventBridge: IEventBridgeRepository;

  constructor(repo: IBasketRepository, eventBridge: IEventBridgeRepository) {
    this.repo = repo;
    this.eventBridge = eventBridge;
  }

  public async handle(event: APIGatewayProxyEvent) {
    const bodySchema = z.object({
      userName: z.string(),
      attributes: z.record(z.string()),
    });

    if (!event.body)
      throw new Error('Request body is null');

    const { attributes, userName } = bodySchema.parse(JSON.parse(event.body));

    const basket = await this.repo.get(userName);
    const checkkoutPayload = this.prepareOrderPayload({ attributes, userName }, basket);
    const publishedEvent = await this.eventBridge.publishCheckoutBasketEvent(checkkoutPayload);
    console.log('Put event output:', { ...publishedEvent });
    await this.repo.delete(userName);

    return { message: 'Success' };
  }

  private prepareOrderPayload(checkoutRequest: any, basket: any) {
    console.log('Preparing order payload');

    if (basket === undefined || basket === null) {
      console.error('Basket is', basket);
      throw new Error('Basket should exist');
    }

    if (!basket.items) throw new Error('Basket does not have items');

    let totalPrice = 0;
    for (const item of basket.items)
      totalPrice += item.price;

    checkoutRequest.totalPrice = totalPrice;
    console.log('Chekcout before assign from basket request:', checkoutRequest);

    Object.assign(checkoutRequest, basket);
    console.log('Checkout after assign from basket:', checkoutRequest);
    return checkoutRequest;
  }
}

export { CheckoutBasketUseCase }
