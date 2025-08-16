const Joi = require('joi');

const transactionSchema = Joi.object({
  description: Joi.string().required(),
  amount: Joi.number().greater(0).required(),
  type: Joi.string().valid('income', 'expense').required(),
  transaction_date: Joi.date().required(),
  user_id: Joi.number().integer().required()
}).unknown(false);

const PatchSchema = transactionSchema.fork(
  ['description', 'amount', 'type', 'transaction_date', 'user_id'],
  field => field.optional()
).unknown(false);

const PostSearchSchema = Joi.object({
  user_id: Joi.number().integer().optional(),
  description: Joi.string().optional(),
  minAmount: Joi.number().optional(),
  maxAmount: Joi.number().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional()
}).unknown(false);

module.exports = { transactionSchema, PatchSchema, PostSearchSchema};
