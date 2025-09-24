const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { LoginSchema, RegisterSchema } = require('../Schemas/userSchemas');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const validation = LoginSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(d => d.message);
        return res.status(422).send(errors);
    }
    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userExists.rows[0];
        if (!user) {
            return res.status(404).send('User not found')
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid password');
        }
       const AccessToken = jwt.sign(
        { userId: user.id , name: user.name },              
        process.env.JWT_ACCESS,         
        { expiresIn: '20s' }              
        );

        const RefreshToken = jwt.sign(
            { userId: user.id, name: user.name },              
            process.env.JWT_REFRESH,         
            { expiresIn: '7d' }              
        );
        
        res.cookie('refreshToken', RefreshToken, {
            httpOnly:true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: true, // Only send to SSL connections
            sameSite: 'none' //Development only, in deploy set to 'strict'
            }
        );  

        console.log(RefreshToken)
        return res.status(200).send({message: 'User successfully logged' ,
            token:AccessToken,
            id: user.id,
            name: user.name
        });
    } catch (err) {
        console.log(err)
        return res.status(400).send('Error during the login');
    }
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const validation = RegisterSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(d => d.message);
        return res.status(422).send(errors);
    }

    try {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).send('Email already registered');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, passwordHash]
        );

        return res.status(201).send('User successfully registered');
    } catch (err) {
        return res.status(400).send('Error while registering');
    } 
};


exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).send('Refresh token not found');
        }

        const { id, name } = req.body;
        if (!id || !name) {
            return res.status(401).send('User credentials required');
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
        if (decoded.userId !== id || decoded.userName !== name) {
            return res.status(403).send('Invalid token for this user');
        }

        const accessToken = jwt.sign(
            { userId: id, name: name },
            process.env.JWT_ACCESS,
            { expiresIn: '15m' }  
        );

        return res.status(200).send({
            token: accessToken
        });
    } catch (err) {
        return res.status(401).send('User does not have access');
    }
};
