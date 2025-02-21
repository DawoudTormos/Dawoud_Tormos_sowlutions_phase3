const db = require('../Libraries/Database')



async function updateLocation(userId, latitude,longtitude,req,res){


    let lastLocationId = await db.query(`
        INSERT INTO user_location
                (userid,
                longtitude,
                latitude)
        VALUES($1, $2, $3)
        RETURNING id;
    
        `, [userId, longtitude ,latitude])
        .catch(error => {
                    console.log(error)
                    return res.status(400).json(
                        {
                            "status": "Bad request",
                            "message": "adding unsuccessful",
                            "statusCode": 400
                        }
                    )
                });
                lastLocationId = lastLocationId.rows[0].id
                console.log(lastLocationId)


            await db.query(`
        update users
        set lastlocation = $1
        where userid = $2;

        `, [lastLocationId, userId])
        
        .then(async () => {
        return res.status(200).json({
                "status": "success",
                "message": "location updated successfully",

        })}).catch(error => {
                    console.log(error)
                    return res.status(400).json(
                        {
                            "status": "Bad request",
                            "message": "adding unsuccessful",
                            "statusCode": 400
                        }
                    )
                });
}


module.exports = {updateLocation};