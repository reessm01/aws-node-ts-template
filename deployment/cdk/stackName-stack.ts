import { Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { CorsOptions, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Config, environment } from './environment';

interface BuildLambdaProps {
    functionName: string;
    handlerFileName: string;
    stackId: string;
    description: string;
    environment?: { [key: string]: string };
}

export class StackNameStack extends Stack {
    private readonly displayName = 'aws-node-ts-template';
    private readonly env = process.env.environment || 'development'; // add environment specific details specific to however its handled in a ci/cd pipeline
    private readonly config: Config = (environment as any)[this.env] || environment.development;
    constructor(scope: Construct, stackId: string, props: StackProps) {
        super(scope, stackId, props);

        const exampleFunction = this.buildLambdaFunction({
            description: 'example lambda description',
            functionName: `example-lambda-${this.env}`,
            handlerFileName: 'exampleLambda',
            stackId,
            environment: {
                exampleProp: 'additionalEnvVariable',
                exampleUrlProp: this.config.exampleEnvSpecificURL,
            },
        });
        const exampleFunctionIntegration = new LambdaIntegration(exampleFunction);

        //  Construct the api service
        const exampleApiConstruct = new RestApi(this, `${this.displayName}-apigw`, { restApiName: 'api-gateway-example' });
        exampleApiConstruct.root.addCorsPreflight(this.corsConfig);

        //  Define the api service
        const exampleEndpointResource = exampleApiConstruct.root.addResource('hello');
        exampleEndpointResource.addMethod('POST', exampleFunctionIntegration);
        exampleEndpointResource.addMethod('GET', exampleFunctionIntegration);
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
            LOG_LEVEL: this.config.logLevel,
            ENVIRONMENT: this.env,
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
