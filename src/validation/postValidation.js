import Joi from 'joi';

const baseSchema = Joi.object({
  postId: Joi.number().integer().min(1),
  name: Joi.string().min(1).max(100).pattern(/\S/),
  email: Joi.string().email({ tlds: { allow: false } }).max(100),
  body: Joi.string().min(1).max(500).pattern(/\S/)
})
  .unknown(false)
  .required()
  .messages({
    'string.pattern.base': '"{#label}" ne doit pas etre vide'
  });

export function validatePostBody(payload, { requireAll }) {
  const schema = requireAll
    ? baseSchema.fork(['postId', 'name', 'email', 'body'], (field) => field.required())
    : baseSchema.min(1);

  const { error, value } = schema.validate(payload, { convert: false });
  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400
    throw err;
  }

  return value;
}

export function parsePositiveInt(rawValue) {
  if (typeof rawValue !== 'string' || !/^\d+$/.test(rawValue)) {
    return null;
  }

  const num = Number(rawValue);
  return Number.isSafeInteger(num) && num >= 1 ? num : null;
}
