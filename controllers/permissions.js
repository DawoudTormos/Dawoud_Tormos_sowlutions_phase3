const db = require('../Libraries/Database')



async function givePermission(userId,id,req,res){


    await db.query(`
            INSERT INTO user_permission
                    (user_giving,
                    user_receiving)
            VALUES($1, $2)
                    
            
                
            `, [userId, id]);
    
    let record =  await db.query(`
        Select 
                *
        from user_permission
        where
                user_giving::integer = $1  and user_receiving::integer = $2
                
    
            
        `, [userId, id]);
    
        if (record.rowCount > 0) {
            record.rows = record.rows.map(e => {
                e.orgId = e.orgid;
                delete e.orgid
                return e
            })
            return res.status(200).json(
                {
                    "status": "success",
                    "message": "Fetched successful",
                    "data": {
                        "permissions Added": record.rows
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


module.exports = {givePermission};