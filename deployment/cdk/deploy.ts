import { App } from '@aws-cdk/core';
import { StackNameStack } from './stackName-stack';
require('dotenv').config();

const app = new App();
const target = process.env.environment || 'sandbox';

new StackNameStack(app, `aws-node-ts-template-${target}`, {
    env: {
        region: 'us-east-2',
        // account: process.env.account,
    },
});
