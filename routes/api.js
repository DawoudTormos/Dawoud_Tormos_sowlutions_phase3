const express = require('express');
const wsexpress = require('websocket-express');
const router = new wsexpress.Router();
const db = require('../Libraries/Database')
const users = require('../controllers/users')
const permissions = require('../controllers/permissions')


router.get("/users/:id", async (req, res) => {
    const { id } = req.params
    const userId = req.userId

    return users.getUser(id ,req, res)
})


router.ws('/ws', async (req, res) => {
    const userId = req.userId

    const ws = await res.accept();
    ws.on('message', (msg) => {
      ws.send(`echo ${msg}`);
    });
    ws.send('hello');
  });



router.get("/myProfile", async (req, res) => {
    const userId = req.userId

    return users.getMyProfile(userId, req, res)
})


router.get("/givepermission/:id", async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    return permissions.givePermission(userId,id,req,res)
})


router.post("/updateLocation", async (req, res) => {
    const userId = req.userId
    const { latitude,longtitude } = req.body
    console.log(typeof latitude)





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
})


module.exports = router;