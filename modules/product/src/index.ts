import { APIGatewayProxyHandler } from "aws-lambda";

const handler: APIGatewayProxyHandler = async (event) => {
  console.log("request", JSON.stringify(event, null, 2));
  return {
    body: `Hello from Product! You've hit ${event.path}`,
    statusCode: 200
  }
}

export { handler }
