export interface ServiceResponse<T> {
  data?: T;
  err?: ServiceError;
  status: boolean;
}

interface ServiceError {
  message: string;
  code: number;
  details?: { field: string; message: string }[];
}

export const INTERNAL_SERVER_ERROR_SERVICE_RESPONSE: ServiceResponse<{}> = {
  status: false,
  data: {},
  err: {
    message: "Internal Server Error",
    code: 500
  }
}

export const INVALID_ID_SERVICE_RESPONSE: ServiceResponse<{}> = {
  status: false,
  data: {},
  err: {
    message: "Invalid ID, Data not Found",
    code: 404
  }
}



// 409 Conflict Response
export function ConflictResponse(message: string = "Data already exists"): ServiceResponse<{}> {
  return {
    status: false,
    data: {},
    err: {
      message,
      code: 409
    }
  }
}


export function BadRequestWithMessage(message: string): ServiceResponse<{}> {
  return {
    status: false,
    data: {},
    err: {
      message,
      code: 404
    }
  }
}