import { RemovalPolicy } from "aws-cdk-lib"
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"

export class SwnDatabase extends Construct {
  public readonly productTable: ITable;
  public readonly basketTable: ITable;
  public readonly orderingTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.productTable = this.createProductTable()
    this.basketTable = this.createBasketTable()
    this.orderingTable = this.createOrderingTable()
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
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }

  private createOrderingTable(): ITable {
    return new Table(this, 'OrderingTable', {
      partitionKey: { name: 'userName', type: AttributeType.STRING },
      sortKey: { name: 'orderDate', type: AttributeType.STRING },
      tableName: 'order',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}