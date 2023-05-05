import { Type } from "typescript";

const Joi = require("joi");
const { CustomError } = require("../Helper/exceptionHelper");

class UserValidator {
  static async validateUser(userData : Type) {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(20).required(),
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(6).required(),
    });

    return schema.validateAsync(userData);
  }
}

module.exports = UserValidator;
