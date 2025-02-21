const db = require('../Libraries/Database')


async function getUser(id, req, res){


        let record = await db.query(`
            SELECT 
                    users.userid::VARCHAR,
                    users.firstname,
                    users.lastname,
                    users.email,
                    users.phone
                FROM 
                    users
                 WHERE
                    users.userid::VARCHAR = $1 
            `, [id]);
    
        if (record.rowCount > 0) {
            let { userid, firstname, email, lastname, phone } = record.rows[0];
            return res.status(200).json(
                {
                    "status": "success",
                    "message": "Fetched successful",
                    "data": {
                        "userId": userid,
                        "firstName": firstname,
                        "lastName": lastname,
                        "email": email,
                        "phone": phone,
                    }
                }
            )
        } else {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Client errorqq",
                "statusCode": 400
            })
        }


}





async function getMyProfile(userId, req, res){

    console.log(userId)
     let record = await db.query(`
            SELECT 
                    users.userid::VARCHAR,
                    users.firstname,
                    users.lastname,
                    users.email,
                    users.phone
                FROM 
                    users
                 WHERE
                    users.userid = $1 
            `, [userId]);
    
        if (record.rowCount > 0) {
            let { userid, firstname, email, lastname, phone } = record.rows[0];
            return res.status(200).json(
                {
                    "status": "success",
                    "message": "Fetched successful",
                    "data": {
                        "userId": userid,
                        "firstName": firstname,
                        "lastName": lastname,
                        "email": email,
                        "phone": phone,
                    }
                }
            )
        } else {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Client error",
                "statusCode": 400
            })
        }


}

module.exports = {getUser, getMyProfile};