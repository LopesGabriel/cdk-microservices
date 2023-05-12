import { RemovalPolicy } from "aws-cdk-lib"
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"

export class SwnDatabase extends Construct {
  public readonly productTable: ITable;
  public readonly basketTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.productTable = this.createProductTable()
    this.basketTable = this.createBasketTable()
  }

  private createProductTable(): ITable {
    return new Table(this, 'ProductTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'product'
    })
  }

  private createBasketTable(): ITable {
    return new Table(this, 'BasketTable', {
      partitionKey: { name: 'userName', type: AttributeType.STRING },
      tableName: 'basket',
      billingMode: BillingMode.PROVISIONED,
      writeCapacity: 1,
      readCapacity: 1,
    })
  }
}