import api from "../config/axiosConfig";
import type {
  IUser,
  IRegisterData,
  ILoginData,
  IUpdateUserData,
  IApiResponse,
  IAuthResponse,
} from "../../shared/types/index";
import type { AxiosError } from "axios";

interface IUserService {
  register: (userData: IRegisterData) => Promise<IAuthResponse>;
  login: (loginData: ILoginData) => Promise<IAuthResponse>;
  getProfile: () => Promise<IApiResponse<IUser>>;
  getAllUsers: () => Promise<IApiResponse<IUser[]>>;
  getUserById: (id: string) => Promise<IApiResponse<IUser>>;
  createUser: (userData: IRegisterData) => Promise<IApiResponse<IUser>>;
  updateUser: (id: string, userData: IUpdateUserData) => Promise<IApiResponse<IUser>>;
  deleteUser: (id: string) => Promise<IApiResponse<null>>;
  deleteAllUsers: () => Promise<IApiResponse<null>>;
  logout: () => void;
}

const userService: IUserService = {
  // Register a new user
  register: async (userData: IRegisterData): Promise<IAuthResponse> => {
    try {
      const response = await api.post<IAuthResponse>(
        "/users/register",
        userData
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Registration failed",
        }
      );
    }
  },

  // Login user
  login: async (loginData: ILoginData): Promise<IAuthResponse> => {
    try {
      const response = await api.post<IAuthResponse>("/users/login", loginData);

      // Backend returns token inside data object
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || { success: false, message: "Login failed" }
      );
    }
  },

  getProfile: async (): Promise<IApiResponse<IUser>> => {
    try {
      const response = await api.get<IApiResponse<IUser>>("/users/profile");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Get Profile failed",
        }
      );
    }
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<IApiResponse<IUser[]>> => {
    try {
      const response = await api.get<IApiResponse<IUser[]>>("/users");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Get All Users failed",
        }
      );
    }
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<IApiResponse<IUser>> => {
    try {
      const response = await api.get<IApiResponse<IUser>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Get User By Id failed",
        }
      );
    }
  },

  createUser: async (userData: IRegisterData): Promise<IApiResponse<IUser>> => {
    try {
      const response = await api.post<IApiResponse<IUser>>("/users", userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Create User failed",
        }
      );
    }
  },

  // Update a user
  updateUser: async (id: string, userData: IUpdateUserData): Promise<IApiResponse<IUser>> => {
    try {
      const response = await api.put<IApiResponse<IUser>>(`/users/${id}`,userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Update User failed",
        }
      );
    }
  },

  // Delete a user
  deleteUser: async (id: string): Promise<IApiResponse<null>> => {
    try {
        const response = await api.delete<IApiResponse<null>>(`/users/${id}`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<IApiResponse<null>>;
        throw (
            axiosError.response?.data || {
            success: false,
            message: "Delete User failed",
        }
      );
    }

  },

  deleteAllUsers: async (): Promise<IApiResponse<null>> => {
    try {
      const response = await api.delete<IApiResponse<null>>(
        "/users/deleteAllUsers"
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse<null>>;
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Delete All Users failed",
        }
      );
    }
  },

  // Logout
  logout: (): void => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
};

export default userService;
