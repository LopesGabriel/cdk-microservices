import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { IOrderingRepository } from "../IOrderingRepository";
import { marshall } from "@aws-sdk/util-dynamodb";

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
}

export { DynamoOrderingRepository }
