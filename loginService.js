exports.handler = function(event, context, callback) {
    let mysql = require('promise-mysql');

    let username = event.username;
    let password = event.password;

    mysql.createConnection({
        host: '********', // TODO
        user: '******', // TODO
        password: '*****', // TODO
        database: '****' // TODO
    }).then(function(conn){
        let selectQuery = "select * from registrations where username = '"+username+"' and password = '"+password+"'";
        let result = conn.query(selectQuery);
        conn.end();
        return result;
    }).then(function(result){
        if(result.length == 1) {

            let successResponse = {
                result : "success",
                name : result[0].name,
                phone: result[0].phone,
            };
            console.log("Loginservice success :" + JSON.stringify(successResponse))
            callback(null, successResponse);
        } else {
            let failResponse = {
                result : "fail",
                error : "Multiple users with same user name"
            };
            console.log("Loginservice fail :" + failResponse)
            callback(failResponse, failResponse)
        }

    }).catch(err => {
        let failResponse = {
            result : "fail",
            error : err
        };
        console.log("Loginservice error fail :" + failResponse)
        callback(err, failResponse)
    })


};

