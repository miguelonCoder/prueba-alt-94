export enum Status {
  LOADING,
  SUCCESS,
  ERROR
}

export interface StatusResponse<T> {
  status: Status
  data?: T
}