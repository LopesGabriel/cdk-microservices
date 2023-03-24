import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { IProductRepository, IUpdateProductArgs } from "../IProductRepository";

class ProductRepository implements IProductRepository {
  private tableName = process.env.DYNAMODB_TABLE_NAME!;
  private dynamo: DynamoDBClient;

  constructor() {
    this.dynamo = new DynamoDBClient({});
  }

  async create(data: any) {
    const now = new Date().toISOString();
    const product = { ...data, CreatedAt: now, UpdatedAt: now }
    const putParams: PutItemCommandInput = {
      Item: marshall(product, { removeUndefinedValues: true }),
      TableName: this.tableName
    }

    try {
      const createResult = await this.dynamo.send(new PutItemCommand(putParams));
      console.log('Create result:', createResult);
      return product;
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

  async update(data: IUpdateProductArgs) {
    const product = { ...data, UpdatedAt: new Date().toISOString() };
    const updateParams: UpdateItemCommandInput = {
      Key: marshall({ id: product.id }),
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ...marshall({ ':updatedAt': product.UpdatedAt })
      },
      UpdateExpression: "set UpdatedAt = :updatedAt",
      ReturnValues: "ALL_NEW"
    }

    if (product.ProductDescription !== undefined) {
      updateParams.UpdateExpression += ", ProductDescription = :productDescription";
      updateParams.ExpressionAttributeValues = {
        ...updateParams.ExpressionAttributeValues,
        ...marshall({ ':productDescription': product.ProductDescription })
      }
    }

    if (product.ProductName !== undefined) {
      updateParams.UpdateExpression += ", ProductName = :productName";
      updateParams.ExpressionAttributeValues = {
        ...updateParams.ExpressionAttributeValues,
        ...marshall({ ':productName': product.ProductName })
      }
    }

    if (product.ProductPrice !== undefined) {
      updateParams.UpdateExpression += ", ProductPrice = :productPrice";
      updateParams.ExpressionAttributeValues = {
        ...updateParams.ExpressionAttributeValues,
        ...marshall({ ':productPrice': product.ProductPrice })
      }
    }

    try {
      const data = await this.dynamo.send(new UpdateItemCommand(updateParams));
      if (data.Attributes) {
        return unmarshall(data.Attributes);
      }

      return data;
    } catch (err) {
      console.error(err)
      throw err;
    }
  }

  async delete(productId: string) {
    const deleteParams: DeleteItemCommandInput = {
      Key: marshall({ id: productId }),
      TableName: this.tableName
    }

    try {
      await this.dynamo.send(new DeleteItemCommand(deleteParams));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { ProductRepository };
