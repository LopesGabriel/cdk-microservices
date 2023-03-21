import { DynamoDBClient, GetItemCommand, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { IProductRepository } from "../IProductRepository";

class ProductRepository implements IProductRepository {
  private tableName = process.env.DYNAMODB_TABLE_NAME!;
  private dynamo: DynamoDBClient;

  constructor() {
    this.dynamo = new DynamoDBClient({});
  }

  async create(data: any) {
    const putParams: PutItemCommandInput = {
      Item: marshall(data, { removeUndefinedValues: true }),
      TableName: this.tableName
    }

    try {
      const createResult = await this.dynamo.send(new PutItemCommand(putParams));
      console.log('Create result:', createResult);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async get(productId: string) {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id: productId })
    };

    try {
      const { Item } = await this.dynamo.send(new GetItemCommand(params));

      if (Item === undefined) {
        throw new Error("Could not find Product with id " + productId);
      }

      return unmarshall(Item);
    } catch (err) {
      console.error(err)
      throw err;
    }
  }

  async list() {
    const params: ScanCommandInput = {
      TableName: this.tableName,
    }

    try {
      const { Items } = await this.dynamo.send(new ScanCommand(params));

      if (Items === undefined) return [];

      return Items.map((item) => unmarshall(item));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update() {
    // TODO
  }

  async delete() {
    // TODO
  }
}

export { ProductRepository };
