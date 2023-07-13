import { AttributeValue, DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, GetItemCommandInput, KeySchemaElement, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput, ScanCommandOutput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { IBasketRepository } from "../IBasketRepository";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const {
  PRIMARY_KEY,
  DYNAMODB_TABLE_NAME
} = process.env;

class BasketDynamoRepository implements IBasketRepository {
  private repo: DynamoDBClient;

  constructor() {
    this.repo = new DynamoDBClient({});
  }

  async create(data: any) {
    const params: PutItemCommandInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Item: marshall(data),
    }

    try {
      await this.repo.send(new PutItemCommand(params))

      return data
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async get(userName: string) {
    const params: GetItemCommandInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Key: { },
    }
    params.Key![PRIMARY_KEY!] = { S: userName }

    try {
      const op = await this.repo.send(new GetItemCommand(params))

      return unmarshall(op.Item!)
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async list() {
    const items: any[] = [];
    const params: ScanCommandInput = {
      TableName: DYNAMODB_TABLE_NAME!
    }

    try {
      let lastEvaluatedItem: Record<string, AttributeValue> | undefined = undefined;
      do {
        const op: ScanCommandOutput = await this.repo.send(new ScanCommand({
          ...params,
          ExclusiveStartKey: lastEvaluatedItem
        }));

        lastEvaluatedItem = op.LastEvaluatedKey;
        if (op.Items) items.push(...op.Items.map(item => unmarshall(item)));
      } while(lastEvaluatedItem);
    } catch (err) {
      console.error(err)
      throw err;
    }

    return items;
  }

  async update(data: any) {
    const params: UpdateItemCommandInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Key: {
        [PRIMARY_KEY!]: { S: data[PRIMARY_KEY!] }
      },
      ReturnValues: 'ALL_NEW',
    }

    for (let [key, value] of Object.entries(data)) {
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        [`:${key}`]: marshall(value)
      }
      params.UpdateExpression = params.UpdateExpression
        ? params.UpdateExpression += `SET ${key} = :${key} `
        : `SET ${key} = :${key} `
    }

    try {
      const op = await this.repo.send(new UpdateItemCommand(params))
      if (op.Attributes) return op.Attributes;
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(userName: string) {
    const params: DeleteItemCommandInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Key: {
        [PRIMARY_KEY!]: { S: userName }
      }
    }

    try {
      const op = await this.repo.send(new DeleteItemCommand(params))
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { BasketDynamoRepository }
