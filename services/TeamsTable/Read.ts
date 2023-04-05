import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../Shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello world'
    };
    
    addCorsHeader(result);

    try {
        result.body = await scanTable();
    } catch (error) {
        result.statusCode = 500;
        result.body = JSON.stringify(error);
    }

    return result;
}

async function scanTable(){
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!
    }).promise();
    return JSON.stringify(queryResponse.Items)
}

export { handler }