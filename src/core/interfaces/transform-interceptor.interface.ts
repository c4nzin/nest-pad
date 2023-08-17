export interface IResponse<T> {
  message: string;
  data: T;
  statusCode: number;
  method: string;
}
