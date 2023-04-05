import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { addCorsHeader, getEventBody } from "../Shared/Utils";
import { InvalidFieldError, MissingFieldError, validateEntry } from "../Shared/InputValidator";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello world'
    };
    
    addCorsHeader(result);

    try {
        const item = getEventBody(event);
        validateEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
        result.body = JSON.stringify(item);

    } catch (error) {
        if (error instanceof MissingFieldError || error instanceof InvalidFieldError) {
            result.statusCode = 403;
        } else {
            result.statusCode = 500;
        }
        result.body = JSON.stringify(error);
    }
    return result;
}

export { handler }