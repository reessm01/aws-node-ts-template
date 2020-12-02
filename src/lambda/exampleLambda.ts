import { APIGatewayProxyHandler } from 'aws-lambda';
import { isEmpty } from 'lodash';

export const handler: APIGatewayProxyHandler = async (event) => {
    const test = JSON.parse((event.body as string) || '{}');
    const responseBody = isEmpty(test) ? `Hello from Lambda!` : `Hello from Lambda! ${test.name}`;
    return {
        isBase64Encoded: false,
        statusCode: 200,
        body: responseBody,
        headers: {
            'Content-Type': 'application/json',
        },
    };
};
