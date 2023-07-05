import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from "@aws-sdk/client-eventbridge";
import { ICheckoutPayload, IEventBridgeRepository } from "../IEventBridgeRepository";

class EventBridgeRepository implements IEventBridgeRepository {
  readonly client;

  constructor() {
    this.client = new EventBridgeClient({})
  }

  public async publishCheckoutBasketEvent(checkoutPayload: ICheckoutPayload) {
    const params: PutEventsCommandInput = {
      Entries: [
        {
          Detail: JSON.stringify(checkoutPayload),
          DetailType: 'CheckoutBasket',
          EventBusName: 'SwnEventBus',
          Source: 'com.swn.basket.checkoutbasket',
        }
      ]
    }

    return await this.client.send(new PutEventsCommand(params));
  }

}

export { EventBridgeRepository }