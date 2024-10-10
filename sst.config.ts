/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "serverless-hello-world",
            removal: input?.stage === "production" ? "retain" : "remove",
            home: "aws",
        };
    },

    async run() {
        const table = new sst.aws.Dynamo("shop", {
            fields: {
                id: "string",
            },
            primaryIndex: { hashKey: "id" },
        });

        const hono = new sst.aws.Function("hono", {
            url: true,
            link: [table],
            handler: "index.handler",
            environment: {
                NAME: "friend",
                APP_NAME: "ServerlessHelloWorldExampleApp",
                APP_SECRET: "ServerlessHelloWorldExampleSecret",
            },
        });

        return {
            api: hono.url
        };

    },
});
