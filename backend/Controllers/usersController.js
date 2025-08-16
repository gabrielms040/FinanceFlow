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
            return res.status(404).send('Usuário não encontrado');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Senha incorreta');
        }
       const token = jwt.sign(
        { userId: user.id , name: user.name, email: user.email },              
        process.env.JWT_SECRET,         
        { expiresIn: '6h' }              
        );

        return res.status(200).send({message: 'Usuário logado com sucesso',
            token:token,
            id: user.id,
            name: user.name
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Erro ao fazer login');
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
            return res.status(409).send('Email já cadastrado');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, passwordHash]
        );

        return res.status(201).send('Usuário registrado com sucesso');
    } catch (err) {
        console.error(err);
        return res.status(400).send('Erro ao registrar usuário');
    } 
};