export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    middleInitial?: string;
    email: string;
    age: number;
    gender: 'male' | 'female' | 'rather not say';
    role: 'staff' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface IRegisterData {
    firstName: string;
    lastName: string;
    middleInitial?: string;
    email: string;
    password: string;
    age: number;
    gender: 'male' | 'female' | 'rather not say';
    role: 'staff' | 'admin';
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface IUpdateUserData extends Partial<Omit<IRegisterData, 'password'>> {
  password?: string;
}