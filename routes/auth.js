const express = require('express');
const router = express.Router();
const db = require('../Libraries/Database')
const jwt = require('../Libraries/Jwt')
const crypto = require('crypto');
const bcrypt = require('bcrypt');


router.post("/register", async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body
    let errors = [];

    if (!firstName || firstName.length == 0) {
        errors.push({
            "field": "firstName",
            "message": "First name is invalid"
        })
    }
    if (!lastName || lastName.length == 0) {
        errors.push({
            "field": "lastName",
            "message": "Last name is invalid"
        })
    }
    if (!password || password.length == 0) {
        errors.push({
            "field": "password",
            "message": "Password is invalid"
        })
    }
    if (!email || email.length == 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({
            "field": "email",
            "message": "Email is invalid"
        })
    }

    if (errors.length > 0) {
        return res.status(422).json({
            "errors": errors
        })
    }



    let saltRounds = 11
    let hashedPassword = ""
    // Hashing the password with bycrypt and salting
    await bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            // Handle error
            console.log('err:', err.message, saltt);

            return;
        }
        console.log('salt:', salt);

     bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            // Handle error
            console.log('err:', err.message );
            return;
        }

        hashedPassword = hash
    // Hashing successful, 'hash' contains the hashed password
    console.log('Hashed password:', hash);

    return  db.query(`
        INSERT INTO users (firstName, lastName, email, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING userId
        `, [
        firstName,
        lastName,
        email,
        hashedPassword,
        phone || ""
    ])
        .then(async () => {
            const userid = await (await db.query(`SELECT userId as userid from users where email=$1`, [email])).rows[0]



            const token = await jwt.generateToken({
                userId: userid.userid
            })

            return res.status(201).json({
                "status": "success",
                "message": "Registration successful",
                "data": {
                    "accessToken": token,
                    "user": {
                        "userId": "" + userid.userid,
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "phone": phone || "",
                    }
                }
            })
        }).catch(error => {
            console.log(error)
            return res.status(400).json(
                {
                    "status": "Bad request",
                    "message": "Registration unsuccessful",
                    "statusCode": 400
                }
            )
        })
    });

    });

    


   
})

router.post("/login", async (req, res) => {

    const { email, password } = req.body


    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length == 0) {
        return res.status(401).json({
            "status": "Bad request",
            "message": "Authentication failed",
            "statusCode": 401
        })
    }

    // Hash password

    const user = await db.query(`SELECT userid,email, firstname, lastname, phone, password as hashedPassword from users where email =$1 `, [
        email
    ])

    console.log(user.rows[0] )
    if(user.rows.length <1){
        return res.status(401).json({
            "status": "Bad request",
            "message": "user not found",
            "statusCode": 401
        })
    }

    const {  hashedpassword } = user.rows[0]
    
        let { userid, firstname, lastname, phone } = user.rows[0];

        const token = await jwt.generateToken({
        userId: userid
    })

    //console.log(password,hashedpassword )
    await bcrypt.compare(password, hashedpassword, (err, result) => {
        if (err) {
            // Handle error
            console.error('Error comparing passwords:', err);
            return;
        }

if (result) {
        // Passwords match, authentication successful
        //console.log('Passwords match! User authenticated.');

        return res.status(200).json(
            {
                "status": "success",
                "message": "Login successful",
                "data": {
                    "accessToken": token ,
                    "user": {
                        "userId": "" + userid,
                        "firstName": firstname,
                        "lastName": lastname,
                        "email": email,
                        "phone": phone,
                    }
                }
            }
        )


    } else {
        // Passwords don't match, authentication failed
        console.log('Passwords do not match! Authentication failed.');

        return res.status(401).json({
            "status": "Bad request",
            "message": "Authentication failed",
            "statusCode": 401
        })


    }
    });

})



module.exports = router;