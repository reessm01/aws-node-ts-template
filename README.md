<div align="center">
    <h1>AWS Node-Typescript Template</h1>
    <h4>Preconfigured Node-Typescript AWS Repository</h4>
</div>

## Getting Started
### AWS Setup
1. [Setup Free AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)*
2. [Create Account Level IAM User](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
> - For Permissions give AWS managed policy of `AdministratorAccess`
> - Tags can be whatever I used tag key: `admin` tag value: `sys admin`
> - Be sure to save the .csv otherwise if lost you'll have to create another user
> - It is against best practices to use your root account for access, so follow these extra steps.
3. Download AWS CDK: run in terminal `npm i -g aws-cdk` 
4. Configure CDK login credentials: run in terminal `aws configure`
5. Follow the prompts & provide your AWS access key ID, secret access key, and default region (us-east-2) when prompted.

\* _Do not fret adding a payment method. You can set hard limits as it can be difficult to accrue excessive costs._
### Repository Setup
1. Fork & clone this repo
2. Run `npm i`
3. Add .env file & use .env_example for reference

## Deployment
This project comes deploy ready for experimentation & can be deployed after following the getting started portion of
this readme. Run `npm run deploy-local`.

## Project Structure
Leverage the project's structure for well organized code.
1. `src/infrastructure` for clients, services & local dependencies
2. `src/interfaces` for TypeScript interfaces, enums, etc.
3. `src/lambda` self-explanatory
4. `deployment/cdk` for AWS specific cdk deployment details
5. `deployment/cdk/environment.ts`
