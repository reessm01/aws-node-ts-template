import { ApolloError, ApolloServer, AuthenticationError } from 'apollo-server-lambda';
import { importSchema } from 'graphql-import';
import { GraphQLFormattedError, GraphQLError } from 'graphql';
import { LogLevel } from 'aws-cdk/lib/logging';

const typeDefs = importSchema('./schema-apollo.graphql');
const logLevel = +(process.env.LOG_LEVEL || LogLevel.DEBUG) as LogLevel;

const resolvers = {
    Query: {},
    Mutation: {},
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({}),
    debug: false,
    formatError: (error: GraphQLError): GraphQLFormattedError<Record<string, any>> => {
        if (error.originalError instanceof AuthenticationError) {
            return new ApolloError('Unauthorized', '401');
        }

        if (logLevel === LogLevel.DEBUG) {
            return new ApolloError(error.message, '500');
        } else {
            return new ApolloError('Internal Server Error', '500');
        }
    },
    context: async() => { // payload as input
    }
});

exports.graphqlHandler = server.createHandler();
