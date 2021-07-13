const AWS = require('aws-sdk');
let db = new AWS.DynamoDB.DocumentClient({
    region: 'ap-south-1'
});

const sns = new AWS.SNS({
    region: 'ap-south-1'
});

const apiResponse = (code, status, message, data) => {
    let responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };
    return {
        statusCode: code ? code : 200,
        headers: responseHeaders,
        body: JSON.stringify({
            status: status ? status : false,
            message: message ? message : "Internal server error",
            data: data ? data : {}
        })
    };
}

exports.handler = async (event) => {
    try {
        console.log("event data", event)
        let body = JSON.parse(event.body); 
        console.log(body);
        const params = {
            TableName: 'students',
            Item: body
        };
        return db.put(params).promise().then(async data => {
            return apiResponse(200, true, "Feedback sent successfully!", data);
        }).catch(error => {
            return apiResponse(500, false, "failed to send feedback", error.message ? error.message : "internal server error");
        });
    } catch (e) {
        console.log("error @catch block:", e);
        return apiResponse(500, false, "failed to send feedback", e);
    }
}