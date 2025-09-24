const db = require('../db');
const {transactionSchema ,PatchSchema ,PostSearchSchema} = require('../Schemas/transactionSchemas');

//select of all user transactions
exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM transactions WHERE user_id = $1', [req.userId]);
    const transactions = result.rows;
    res.json(
      transactions.map(transaction => ({
        id: transaction.id,
        
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        transaction_date: transaction.transaction_date
      }))
    );
  } catch (error) {
    res.status(401).send(error);
  }
};


//create a new transaction
exports.create = async (req, res) => {
  const { description, amount, type, transaction_date, user_id} = req.body;
  
  const validation = transactionSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map(d => d.message);
    return res.status(422).send(errors);
  }

  try {
    await db.query(
      'INSERT INTO transactions (description, amount, type, transaction_date, user_id) VALUES ($1, $2, $3, $4, $5)',
      [description, amount, type, transaction_date, user_id]
    );
    res.send('Transação criada com sucesso!');
  } catch (error) {
    res.status(401).send(error);
  }
};

//search transactions according to the filters filled in by the user
exports.search = async (req, res) => {
  const searchBody = req.body;
  const validation = PostSearchSchema.validate(searchBody, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map(d => d.message);
    return res.status(422).send(errors);
  }

  let query = 'SELECT * FROM transactions ';
  let conditions = [];
  let values = [];

  if (searchBody.user_id != null) {
    values.push(`%{searchBody.user_id}%`);
    conditions.push(`user_id = $${values.length}`);
  }

  if (searchBody.description != null) {
    values.push(`%${searchBody.description}%`);
    conditions.push(`description ILIKE $${values.length}`);
  }

  function betweenCheck(fieldStart, fieldEnd, column) {
    if (searchBody[fieldStart] != null && searchBody[fieldEnd] != null)
      {
      const id1 = values.length + 1;
      const id2 = values.length + 2;
      values.push(searchBody[fieldStart], searchBody[fieldEnd]);
      conditions.push(`${column} BETWEEN $${id1} AND $${id2}`);
    } else if (searchBody[fieldStart] != null) 
      {
      values.push(searchBody[fieldStart]);
      conditions.push(`${column} >= $${values.length}`);
    } else if (searchBody[fieldEnd] != null) 
      {
      values.push(searchBody[fieldEnd]);
      conditions.push(`${column} <= $${values.length}`);
    }
  }

  betweenCheck('minAmount', 'maxAmount', 'amount');

  if (searchBody.type != null) {
    values.push(searchBody.type);
    conditions.push(`type = $${values.length}`);
  }

  betweenCheck('dateFrom', 'dateTo', 'transaction_date::date');

  const conditionsString = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  query += conditionsString;

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(401).send(error);
  }
};


exports.update = async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, transaction_date} = req.body;

  const validation = PatchSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map(d => d.message);
    return res.status(422).send(errors);
  }

  try {
    const result = await db.query(
      'UPDATE transactions SET amount =$2, description = $3, type = $4, transaction_date::date = $5 WHERE id = $1',
      [id, amount, description, type, transaction_date]
    );

    if (result.rowCount === 0) {
      return res.status(422).send('Transação não encontrada');
    }
    res.send('Transação atualizada com sucesso!');
  } catch (error) {
    res.status(401).send(error);
  }
};


exports.partialUpdate = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const validation = PatchSchema.validate(updates, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map(d => d.message);
    return res.status(422).send(errors);
  }

  if (fields.length === 0) {
    return res.status(422).send('Nenhum campo para atualizar');
  }

  let query = 'UPDATE transactions SET ';
  const setClauses = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
  query += setClauses + ` WHERE id = $${fields.length + 1}`;

  try {
    const result = await db.query(query, [...values, id]);
    if (result.rowCount === 0) {
      return res.status(422).send('Transação não encontrada');
    }
    res.json({ message: 'Transação atualizada com sucesso.' });
  } catch (error) {
    res.status(401).send(error);
  }
};


exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM transactions WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(422).send('Transação nao encontrada');
    } else {
      res.send('Transação deletada!');
    }
  } catch (error) {
    res.status(401).send(error);
  }
};
