import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../Shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME;
const PARTITION_KEY = process.env.PARTITION_KEY as string;
const dbClient = new DynamoDB.DocumentClient();


async function handler(event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello world'
    };
    addCorsHeader(result);

    try {
        const player = event.queryStringParameters?.[PARTITION_KEY];

        if (player) {
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME!,
                Key: {
                    [PARTITION_KEY]: player
                }
            }).promise();
            result.body = JSON.stringify(deleteResult);
        }
    } catch (error) {
        result.statusCode = 500;
        result.body = JSON.stringify(error);
    }

    return result;
}

export { handler }