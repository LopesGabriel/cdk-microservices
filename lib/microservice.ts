import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface ISwnMicroservicesProps {
  productTable: ITable
}

export class SwnMicroservice extends Construct {
  public readonly productMicroservice: IFunction

  constructor(scope: Construct, id: string, props: ISwnMicroservicesProps) {
    super(scope, id)
    const { productTable } = props

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

    this.productMicroservice = new NodejsFunction(this, 'ProductLambdaFunction', {
      ...nodeJsFunctionProps,
      entry: join(__dirname, `../modules/product/src/index.ts`),
    });

    // Granting Lambda access to DynamoDB
    productTable.grantReadWriteData(this.productMicroservice);
  }
}