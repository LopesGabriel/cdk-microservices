import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservice } from './microservice';
import { SwnApiGateway } from './apigateway';
import { SwnEventBus } from './eventBus';
import { SwnQueue } from './queue';

export class CdkMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { productTable, basketTable, orderingTable } = new SwnDatabase(this, 'Databases')
    const { productMicroservice, basketMicroservice, orderMicroservice } = new SwnMicroservice(this, 'Microservices', {
      productTable,
      basketTable,
      orderingTable
    })

    const { orderQueue } = new SwnQueue(this, 'Queue', {
      consumer: orderMicroservice
    })

    const apiGateway = new SwnApiGateway(this, 'Apis', {
      productMicroservice,
      basketMicroservice,
      orderMicroservice
    })

    const event = new SwnEventBus(this, 'EventBus', {
      publisherFunction: basketMicroservice,
      targetQueue: orderQueue
    })
  }
}
