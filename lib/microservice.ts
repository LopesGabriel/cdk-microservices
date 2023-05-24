import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface ISwnMicroservicesProps {
  productTable: ITable
  basketTable: ITable
  orderingTable: ITable
}

export class SwnMicroservice extends Construct {
  public readonly productMicroservice: IFunction
  public readonly basketMicroservice: IFunction
  public readonly orderingMicroservice: IFunction

  constructor(scope: Construct, id: string, props: ISwnMicroservicesProps) {
    super(scope, id)
    this.productMicroservice = this.createProductMicroservice(props)
    this.basketMicroservice = this.createBasketMicroservice(props)
    this.orderingMicroservice = this.createOrderingMicroservice(props)
  }

  private createProductMicroservice({ productTable }: ISwnMicroservicesProps): IFunction {
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

    const productMicroservice = new NodejsFunction(this, 'ProductLambdaFunction', {
      ...nodeJsFunctionProps,
      entry: join(__dirname, `../modules/product/src/index.ts`),
    });

    productTable.grantReadWriteData(productMicroservice);
    return productMicroservice
  }

  private createBasketMicroservice({ basketTable }: ISwnMicroservicesProps): IFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const basketMicroservice = new NodejsFunction(this, 'BasketLambdaFunction', {
      ...nodeJsFunctionProps,
      entry: join(__dirname, `../modules/basket/src/index.ts`),
    });

    basketTable.grantReadWriteData(basketMicroservice)
    return basketMicroservice
  }

  private createOrderingMicroservice({ orderingTable }: ISwnMicroservicesProps): IFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: orderingTable.tableName
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const orderingMicroservice = new NodejsFunction(this, 'OrderingLambdaFunction', {
      ...nodeJsFunctionProps,
      entry: join(__dirname, `../modules/ordering/src/index.ts`),
    });

    orderingTable.grantReadWriteData(orderingMicroservice)
    return orderingMicroservice
  }
}