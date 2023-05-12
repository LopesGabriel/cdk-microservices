import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservice } from './microservice';
import { SwnApiGateway } from './apigateway';

export class CdkMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { productTable, basketTable } = new SwnDatabase(this, 'Databases')
    const { productMicroservice } = new SwnMicroservice(this, 'Microservices', {
      productTable,
      basketTable
    })
    const apiGateway = new SwnApiGateway(this, 'Apis', { productMicroservice })
  }
}
