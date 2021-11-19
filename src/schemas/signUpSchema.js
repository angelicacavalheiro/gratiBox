import Joi from 'joi';

const signUpSchema = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(6).max(15),
});

export default signUpSchema;
