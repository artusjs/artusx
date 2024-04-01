export class ArtusXStdError extends Error {
  name = 'ARTUSX_STD_ERROR';
  data: any;
  status: number;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.data = data;
    this.status = status;
  }
}

export class ArtusXBizError extends Error {
  name = 'ARTUSX_BIZ_ERROR';
  data: any;
  status: number; // 200

  constructor(message: string, code: number, data?: any) {
    super(message);
    this.data = {
      code,
      data,
    };
    this.status = 200;
  }
}

export class ArtusXCustomError extends Error {
  name = 'ARTUSX_CUSTOM_ERROR';
  data: any;
  status: number;

  constructor(status: number, message: string, code: number, data?: any) {
    super(message);

    this.data = {
      code,
      data,
    };

    this.status = status;
  }
}
