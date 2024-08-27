import Joi from 'joi';

export const userSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  dateOfBirth: Joi.date().less('now').allow(null),
  isVerified: Joi.boolean().default(false),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
