import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader, getEventBody } from '../Shared/Utils'

const TABLE_NAME = process.env.TABLE_NAME as string;
const PARTITION_KEY = process.env.PARTITION_KEY as string;
const SORT_KEY = process.env.SORT_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello world'
    };

    addCorsHeader(result);

    try {
        const requestBody = getEventBody(event);
        const player = event.queryStringParameters?.[PARTITION_KEY];

        if (requestBody && player) {
            const requestBodyKey = Object.keys(requestBody)[0];
            const requestBodyValue = requestBody[requestBodyKey];

            const updateResult = await dbClient.update({
                TableName: TABLE_NAME,
                Key: {
                    [PARTITION_KEY]: player
                },
                UpdateExpression: 'set #zzzNew = :new',
                ExpressionAttributeValues: {
                    ':new': requestBodyValue
                },
                ExpressionAttributeNames: {
                    '#zzzNew': requestBodyKey
                },
                ReturnValues: 'UPDATED_NEW'
            }).promise();

            result.body = JSON.stringify(updateResult);
        }
    } catch (error) {
        result.statusCode = 500;
        result.body = JSON.stringify(error);
    }
    return result;
}

export { handler }