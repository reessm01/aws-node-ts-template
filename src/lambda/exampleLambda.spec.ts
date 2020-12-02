import { handler as exampleLambda } from './exampleLambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';

describe('exampleLambda', () => {
    beforeAll(() => {});

    beforeEach(() => {});

    test('example lambda test', async () => {
        const result = (await exampleLambda({} as APIGatewayProxyEvent, {} as Context, {} as Callback)) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe('Hello from Lambda!');
    });

    test('example lambda test with event', async () => {
        const event = { body: JSON.stringify({ name: 'Carl!' }) } as APIGatewayProxyEvent
        const result = (await exampleLambda(
            event,
            {} as Context,
            {} as Callback
        )) as APIGatewayProxyResult;
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe('Hello from Lambda! Carl!');
    });
});
