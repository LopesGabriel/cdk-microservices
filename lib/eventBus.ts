import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface SwnEventBusProps {
  publisherFunction: IFunction,
  targetQueue: IQueue
}

export class SwnEventBus extends Construct {
  public readonly busName: string;
  public readonly ruleName: string;

  constructor(scope: Construct, id: string, props: SwnEventBusProps) {
    super(scope, id);
    const { publisherFunction, targetQueue } = props

    const bus = new EventBus(this, 'SwnEventBus', {
      eventBusName: 'SwnEventBus'
    })

    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus: bus,
      enabled: true,
      description: 'When Basket microservice checkout the basket',
      eventPattern: {
        source: ['com.swn.basket.checkoutbasket'],
        detailType: ['CheckoutBasket']
      },
      ruleName: 'CheckoutBasketRule'
    })

    checkoutBasketRule.addTarget(new SqsQueue(targetQueue))
    bus.grantPutEventsTo(publisherFunction)

    this.busName = bus.eventBusName;
    this.ruleName = checkoutBasketRule.ruleName;
  }
}