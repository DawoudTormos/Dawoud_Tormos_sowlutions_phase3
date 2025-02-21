const express = require('express');
const wsexpress = require('websocket-express');
const router = new wsexpress.Router();
const db = require('../Libraries/Database')
const users = require('../controllers/users')
const permissions = require('../controllers/permissions')
const locations = require('../controllers/locations')


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
    
    return locations.updateLocation(userId, latitude,longtitude,req,res)

})


module.exports = router;