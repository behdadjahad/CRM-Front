import { fetchService } from "@/boot/fetch-service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserRole {
  id: number;
  name: string;
  permissions: any[]; // Replace 'any' with a Permission type if you know the structure
}
export interface UserCount {
  notifications: number;
}
export interface LoginState {
  fullName: string;
  id: number;
  chadcoCustomerId: number;

  roles: UserRole[];
  avatar?: string;
  birthdate?: string;
  cityId?: number;
  deletedAt?: string | null;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  idNumber?: string;
  phoneNumber?: string;
  uniqueId?: string;
  userName?: string;
  _count?: UserCount;
}
const initialState: LoginState = {
 fullName: "",
  id: 0,
  chadcoCustomerId: 0,
  roles: [],
  avatar: undefined,
  birthdate: undefined,
  cityId: undefined,
  deletedAt: null,
  email: "",
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "",
  idNumber: "",
  phoneNumber: "",
  uniqueId: "",
  userName: "",
  _count: { notifications: 0 },
};


const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      const data = action?.payload?.data;
        state.fullName = data?.fullName;
        state.id=data?.id;
       state.roles = data.roles || [];
    state.avatar = data.avatar;
  state.birthdate = data.birthdate;
  state.cityId = data.cityId;
  state.deletedAt = data.deletedAt;
  state.email = data.email;
  state.firstName = data.firstName;
    state.lastName = data.lastName;
      state.middleName = data.middleName;
      state.gender = data.gender;
      state.idNumber = data.idNumber;
      state.phoneNumber = data.phoneNumber;
      state.uniqueId = data.uniqueId;
      state.userName = data.userName;
      state._count = data._count;
    });
  },
});

export const fetchLogin = createAsyncThunk<any>(
  "login/fetchLogin",

  async () => {
    try {
      const result = await fetchService("user");
   
      return result;
    } catch {
      return {};
    }
  }
);
export default loginSlice.reducer;