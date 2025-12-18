import type { IUser } from './user.type';

export interface IApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    data: {
        token?: string;
        user?: IUser;
    }

}

export interface IErrorResponse {
    success: false;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
