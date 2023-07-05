import { PutEventsCommandOutput } from "@aws-sdk/client-eventbridge";

export interface ICheckoutPayload {
  userName: string,
  attributes: Record<string, string>,
  items: any[],
  totalPrice: number,
}

export interface IEventBridgeRepository {
  publishCheckoutBasketEvent: (checkoutPayload: ICheckoutPayload) => Promise<PutEventsCommandOutput>;
}