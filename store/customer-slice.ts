import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";
import { dateType, formatPrice, limitForCustomers, totalVotes } from "@/lib/utils";
import { Communicater } from "@/types/globals";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface CustomerState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
}

const initialState: CustomerState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
};

const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
  //  setData(state, action: PayloadAction<any>) {
  //     state.filters = action.payload;
  //     console.log(action.payload);
  //     state.currentPage = 1;
  //   },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.items = action?.payload?.data?.map((item: any) => ({
        id: item?.id,
        info: {
          "نام ونام خانوادگی": item?.person?.firstName + " " + item?.person?.lastName,
          "کدملی": item?.person?.idNumber,
          "ایمیل": item?.Communication?.email?.find((item:any)=>item?.communicater===Communicater.home)?.communicationDetails,
          "شماره تماس": item?.Communication?.mobile?.[0]?.communicationDetails,
          "شغل": item?.person?.personJobs?.[0]?.jobs?.name,
          "موضوع قرارداد": item?.lastContract?.contractType,
          "رتبه مشتری": item?.rank,
          "قرارداد": convertDate(item?.lastContract?.submitDate, dateType),
          "مبلغ آخرین قرارداد": `${item?.lastContract?.price && formatPrice(item?.lastContract?.price)}`,
        },
        subInfo: {
          [item?.profit < 0 ? "ضرر و زیان" : "سود"]: formatPrice(
            Math.abs(item?.profit)
          ),
          "تعداد مشتری": item?.totalPeopleInContracts,
          "تاریخ آخرین پیگیری": "",
          "نوع آخرین پیگیری": "",
          "وضعیت آخرین پیگیری": "",
          "پیگیری بعدی": "",
          "امتیاز مشتری":item?.avgSatisfactionScore / totalVotes,
        },
      }));
      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(totalItems / limitForCustomers);
      state.currentPage = action.meta.arg.page;
      const filters = action.meta.arg.filters;
      state.filters = filters;
    });
  },
});
export const fetchCustomers = createAsyncThunk<any, any>(
  "customer/fetchCustomers",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `customer/rank?page=${page}&limit=${limit}`,
        {
          method: "POST",
          body: filters,
        }
      );

      return result;
    } catch {
      return {};
    }
  }
);
// export const { setData } = customerSlice.actions;
export default customerSlice.reducer;
