class ResponseHelper {
    static successResponse(data : any, res : any) {
      res.send({
        status: true,
        data: data,
      });
    }
  
    static errorResponse(err: any, res:any) {
      res.status(err.code ?? 500).send({
        status: false,
        err:
          err.name == "CustomValidationError"
            ? err.message
            : err.message
            ? err.message
            : "Something went wrong",
      });
    }
  }
  
  module.exports = ResponseHelper;
  