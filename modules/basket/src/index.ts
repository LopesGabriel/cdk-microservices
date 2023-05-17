import { APIGatewayProxyHandler } from 'aws-lambda'

const handler: APIGatewayProxyHandler = async (event, _context) => {
  return {
    body: JSON.stringify({
      message: 'You hit basket API',
      method: event.httpMethod,
      path: event.path
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: 200
  }
}

export { handler }
