export class ArtusXStdError extends Error {
  name = 'ARTUSX_STD_ERROR';
  data: any;
  status: number;

  constructor(status: number, message: string, data: any) {
    super(message);
    this.data = data;
    this.status = status;
  }
}

export class ArtusXBizError extends Error {
  name = 'ARTUSX_BIZ_ERROR';
  data: any;
  status: 200;

  constructor(code: number, message: string, data: any) {
    super(message);
    this.data = {
      code,
      data,
    };
  }
}

export class ArtusXCustomError extends Error {
  name = 'ARTUSX_CUSTOM_ERROR';
  data: any;
  status: number;

  constructor(code: number, message: string, data: any, status: number) {
    super(message);

    this.data = {
      code,
      data,
    };
    this.status = status;
  }
}
