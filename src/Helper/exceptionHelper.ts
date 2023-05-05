let exceptionHelper = {};
exceptionHelper.CustomError = class CustomError extends Error {
  constructor(message: any, code = 500) {
    super(message);
    this.name = "CustomValidationError";
    this.code = code;
  }
};

module.exports = exceptionHelper;
