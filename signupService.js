exports.handler = function(event, context) {
    let AWS = require('aws-sdk');
    let dynamodb  = new AWS.DynamoDB.DocumentClient();
    console.log('Signup Received event:', JSON.stringify(event, null, 2));

    var params = {
        TableName: "registrations",
        ProjectionExpression:"#nm, #em, #tk",
        KeyConditionExpression: "#em = :emailValue",
        ExpressionAttributeNames:{
            "#nm": "name",
            "#em": "email",
            "#tk": "token"
        },
        ExpressionAttributeValues: {
            ":emailValue":event.email,

        }

    };
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log("Name :" + data.Items[0].name);
            console.log("Email :" + data.Items[0].email);
            console.log("Token :" + data.Items[0].token);

            let name = data.Items[0].name;
            let email = data.Items[0].email;
            let uniqueId = data.Items[0].token;

            let nodemailer = require('nodemailer');


            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '********', // TODO
                    pass: '*********' // TODO
                }
            });



            let mailOptions = {
                from: 'Demo alerts@demo.com',
                to:  email,
                subject: 'Registration successfully',
                html: getHtmlBody(name, email,uniqueId)
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email :' + error);
                }
                console.log('Email sent successfully with messageId: %s', info.messageId);

            })

        }

    });

};

function getHtmlBody(name, email,uniqueId) {
    let fs = require('fs');
    let path = require('path');
    let mailTemplate = fs.readFileSync(path.resolve(__dirname, 'registration-success.html'), 'utf8');

    let emailTemplateData = {
        "%NAME%": name,
        "%EMAIL%": email,
        "%TOKEN%" : uniqueId
    };

    return substitute(mailTemplate, emailTemplateData);

}

function substitute(str, data) {
    let output = str.replace(/%[^%]+%/g, function(match) {
        if (match in data) {
            return(data[match]);
        } else {
            return("");
        }
    });
    return(output);
}