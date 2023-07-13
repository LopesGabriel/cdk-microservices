import { DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, ScanCommand } from "@aws-sdk/client-dynamodb";
import { IOrderingRepository } from "../IOrderingRepository";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

class DynamoOrderingRepository implements IOrderingRepository {
  dbClient: DynamoDBClient;

  constructor() {
    this.dbClient = new DynamoDBClient({});
  }

  async create(order: any) {
    const params: PutItemCommandInput = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Item: marshall(order)
    }

    return await this.dbClient.send(new PutItemCommand(params));
  }

  async getByUsernameAndOrderDate(userName: string, orderDate: string) {
    const params: QueryCommandInput = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      KeyConditionExpression: "userName = :userName and orderDate = :orderDate",
      ExpressionAttributeValues: {
        ":userName": { S: userName },
        ":orderDate": { S: orderDate },
      },
    }

    try {
      const { Items } = await this.dbClient.send(new QueryCommand(params));

      if (Items) {
        return Items.map((item) => unmarshall(item));
      }

      return [];
    } catch (err) {
      throw new Error('Could not retrieve Order by user name and order date', { cause: err });
    }
  }

  async getAllOrders() {
    try {
      const { Items } = await this.dbClient.send(new ScanCommand({
        TableName: process.env.DYNAMO_TABLE_NAME
      }))

      if (Items) {
        return Items.map(item => unmarshall(item));
      }

      return [];
    } catch (err) {
      throw new Error('Could not retrieve all orders', { cause: err });
    }
  }
}

export { DynamoOrderingRepository }
