import { ValidationErrorItem } from "joi";

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  'CURRENCY-POSITION': (message: Currency[]) => void;
  'FOREIGN-CURRENCY': (message: Currency[]) => void;
}

export interface ClientEvents {
}
