import { IBasketRepository } from "../IBasketRepository";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const {
  PRIMARY_KEY,
  DYNAMODB_TABLE_NAME
} = process.env;

class BasketDynamoRepository implements IBasketRepository {
  private repo: DocumentClient;

  constructor() {
    this.repo = new DocumentClient()
  }

  async create(data: any) {
    const params: DocumentClient.PutItemInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Item: data,
    }

    try {
      const op = await this.repo.put(params).promise();

      if (op.$response.error) {
        throw op.$response.error
      }

      return data
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async get(userName: string) {
    const params: DocumentClient.GetItemInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Key: { },
    }
    params.Key[PRIMARY_KEY!] = userName;

    try {
      const op = await this.repo.get(params).promise();

      if (op.$response.error) {
        throw op.$response.error
      }

      return op.Item!
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async list() {
    const items: any[] = [];
    const params: DocumentClient.ScanInput = {
      TableName: DYNAMODB_TABLE_NAME!
    }

    try {
      let lastEvaluatedItem: undefined | DocumentClient.Key;
      do {
        const op = await this.repo.scan({
          ...params,
          ExclusiveStartKey: lastEvaluatedItem
        }).promise();

        if (op.$response.error) {
          throw op.$response.error;
        }

        lastEvaluatedItem = op.LastEvaluatedKey;
        if (op.Items) items.push(...op.Items);
      } while(lastEvaluatedItem);
    } catch (err) {
      console.error(err)
      throw err;
    }

    return items;
  }

  async update(data: any) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Key: {},
      ReturnValues: 'ALL_NEW',
    }
    params.Key[PRIMARY_KEY!] = data[PRIMARY_KEY!];

    for (let [key, value] of Object.entries(data)) {
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        [`:${key}`]: value
      }
      params.UpdateExpression = params.UpdateExpression
        ? params.UpdateExpression += `SET ${key} = :${key} `
        : `SET ${key} = :${key} `
    }

    try {
      const op = await this.repo.update(params).promise();

      if (op.$response.error) {
        throw op.$response.error;
      }

      if (op.Attributes) return op.Attributes;
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(useName: string) {
    const params: DocumentClient.DeleteItemInput = {
      TableName: DYNAMODB_TABLE_NAME!,
      Key: {
        [`${PRIMARY_KEY}`]: useName
      }
    }

    try {
      const op = await this.repo.delete(params).promise()

      if (op.$response.error) {
        throw op.$response.error
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { BasketDynamoRepository }
