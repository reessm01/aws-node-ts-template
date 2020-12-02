import { Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
// import { IVpc, Vpc } from '@aws-cdk/aws-ec2';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { CorsOptions, LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";

interface BuildLambdaProps {
    functionName: string;
    handlerFileName: string; // handlerFileName
    stackId: string;
    description: string;
    environment?: { [key: string]: string };
}

export class StackNameStack extends Stack {
    private readonly displayName = 'aws-node-ts-template';
    // private vpc: IVpc;
    constructor(scope: Construct, stackId: string, props: StackProps) {
        super(scope, stackId, props);

        // const vpcName = process.env.vpc_name as string;

        // this.vpc = Vpc.fromLookup(this, 'VPC', {
        //     vpcName,
        // });

        const targetEnv = process.env.environment || 'sandbox';

        const exampleFunction = this.buildLambdaFunction({
            description: 'example lambda description',
            functionName: `example-lambda-${targetEnv}`,
            handlerFileName: 'exampleLambda',
            stackId,
            environment: {
                exampleProp: 'additionalEnvVariable',
            },
        });
        const exampleFunctionIntegration = new LambdaIntegration(exampleFunction);
        const exampleApiConstruct = new RestApi(this, this.displayName, {});
        const exampleApi = exampleApiConstruct.root;
        exampleApi.addCorsPreflight(this.corsConfig);
        exampleApi.addMethod('POST', exampleFunctionIntegration);

        const exampleGraphQLFunction = this.buildGraphQLFunction({
            description: 'example lambda description',
            functionName: `graphql-fn-${targetEnv}`,
            handlerFileName: '',
            stackId,
            environment: {
                exampleProp: 'additionalEnvVariable',
            },
        });
        const graphQLIntegration = new LambdaIntegration(exampleGraphQLFunction);
        const graphqlEndpoint = exampleApi.addResource('graphql');
        graphqlEndpoint.addMethod('POST', graphQLIntegration, {});
        graphqlEndpoint.addCorsPreflight(this.corsConfig);
    }

    private buildLambdaFunction(props: BuildLambdaProps): Function {
        return new Function(this, props.functionName, {
            ...this.commonLambdaProperties,
            functionName: `${this.displayName}-${props.functionName}`,
            handler: `dist/src/lambda/${props.handlerFileName}.handler`,
            description: props.description,
            environment: {
                ...this.commonEnvironmentProperties,
                ...props.environment,
            },
        });
    }

    private buildGraphQLFunction(props: BuildLambdaProps): Function {
        return new Function(this, props.functionName, {
            ...this.commonLambdaProperties,
            functionName: `${this.displayName}-${props.functionName}`,
            handler: `dist/src/infrastructure/graphql/apollo-resolvers.graphqlHandler`,
            description: props.description,
            environment: {
                ...this.commonEnvironmentProperties,
                ...props.environment,
            },
        });
    }

    private get commonLambdaProperties() {
        return {
            code: new AssetCode(`${this.displayName}.zip`),
            runtime: Runtime.NODEJS_10_X,
            timeout: Duration.seconds(15),
            memorySize: 128,
        };
    }

    private get commonEnvironmentProperties(): { [key: string]: string } {
        return {
            LOG_LEVEL: 'debug',
            ENVIRONMENT: process.env.environment || 'sandbox',
        };
    }

    private get corsConfig(): CorsOptions {
        return {
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent'],
            allowOrigins: ['*'],
            allowCredentials: true,
            allowMethods: ['GET', 'POST'], // add more as needed
        };
    }
}
