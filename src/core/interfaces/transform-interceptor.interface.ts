export interface IResponse<T> {
  data: T;
  statusCode: number;
  method: string;
}
