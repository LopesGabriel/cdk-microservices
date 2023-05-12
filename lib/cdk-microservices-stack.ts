import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**   DynamoDB Table Setup    */
    const productTable = new Table(this, 'ProductTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'Product'
    });

    /**   Lambda Setup    */
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_18_X
    };

    const productFunction = new NodejsFunction(this, 'ProductLambdaFunction', {
      ...nodeJsFunctionProps,
      entry: join(__dirname, `../modules/product/src/index.ts`),
    });

    productTable.grantReadWriteData(productFunction); // Granting Lambda access to DynamoDB

    const apiGateway = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: productFunction,
      proxy: false,
    });

    const products = apiGateway.root.addResource('product');
    products.addMethod('GET');
    products.addMethod('POST');

    const product = products.addResource('{id}');
    product.addMethod('GET');
    product.addMethod('PUT');
    product.addMethod('DELETE');

  }
}
