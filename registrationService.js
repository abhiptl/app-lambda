exports.handler = function(event, context) {
    let AWS = require('aws-sdk');
    var uniqid = require('uniquid');
    let docClient = new AWS.DynamoDB.DocumentClient();
    console.log('Received event:', JSON.stringify(event, null, 2));

    let uniqueId = uniqid();
    let params = {
        TableName: "registrations",
        Item: {
            "name": event.name,
            "email": event.email,
            "token": uniqueId
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);

            let params = {
                FunctionName: "signupService",
                InvocationType: "RequestResponse",
                LogType : 'None',
                Payload: JSON.stringify({"email": event.email})
            };
            let lambdaClient = new AWS.Lambda();
            lambdaClient.invoke(params, function(err, data) {
                if (err) {
                    console.log("signupService invoke failed:" + err, err.stack);
                } else {
                    console.log("signupService invoke succeeded", data);
                }
            });

        }
    });



};