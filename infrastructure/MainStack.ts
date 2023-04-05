import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi, EndpointType, ResourceOptions, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { GenericTable } from './GenericTable';

export class MainStack extends Stack {

    private api = new RestApi(this, 'BetterTomApi',
        {
            endpointConfiguration: {
                types: [EndpointType.REGIONAL]
            }
        }
    );

    private teamsTable = new GenericTable(this, {
        tableName: 'TeamsTable',
        partitionKey: 'player',
        sortKey: 'team',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        deleteAllLambdaPath: 'DeleteAll'
    });

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const optionsWithCors:ResourceOptions = {
            defaultCorsPreflightOptions : {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        // API integration
        const teamResource = this.api.root.addResource('teams', optionsWithCors);
        teamResource.addMethod('POST', this.teamsTable.createLambdaIntegration);
        teamResource.addMethod('GET', this.teamsTable.readLambdaIntegration);
        teamResource.addMethod('PUT', this.teamsTable.updateLambdaIntegration);
        teamResource.addMethod('DELETE', this.teamsTable.deleteLambdaIntegration);

        const teamAllResource = teamResource.addResource('all', optionsWithCors);
        teamAllResource.addMethod('DELETE', this.teamsTable.deleteAllLambdaIntegration);

    }
}
