import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../Shared/Utils';
import { Entry } from '../Shared/Model';

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
        const items = await scanTable();
        for (const item of items) {
            await dbClient.delete({
                TableName: TABLE_NAME!,
                Key: {
                    [PARTITION_KEY]: item.player
                }
            }).promise();
        }
    } catch (error) {
        result.statusCode = 500;
        result.body = JSON.stringify(error);
    }

    return result;
}

async function scanTable() : Promise<Entry[]> {
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!
    }).promise();
    return queryResponse.Items as Entry[];
}

export { handler }