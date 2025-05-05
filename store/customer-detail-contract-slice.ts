import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";
import { dateType, limitForCustomerDetailContracts } from "@/lib/utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface CustomerDetailContractState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
}

const initialState: CustomerDetailContractState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
};
const customerDetailContractSlice = createSlice({
  name: "customerDetailContract",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerDetailContract.fulfilled, (state, action) => {
      state.items = action.payload.data.map((item: any) => ({
        "شماره قرارداد": item?.contractNo,
        "تاریخ قرارداد": convertDate(item?.contractDate, dateType),
        "میزان درآمد": item?.sellPrice,
        "سود و زیان": "",
        مقصد: `${item?.destinationCountry},${item?.destinationCity}`,
        "موضوع قرارداد": "",
        اپراتور: " ",
        وضعیت: "",
        "تاریخ شروع": "",
        "تاریخ پایان": "",
        "تعداد مشتری": "",
        رضایتمندی: item?.contractSatisfaction[0]?.satisfactionScore / 10,
      }));
      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(totalItems / limitForCustomerDetailContracts);
      state.currentPage = action.meta.arg.page;
    });

    },

});
export const fetchCustomerDetailContract = createAsyncThunk<any, any>(
  "customerDetailContract/fetchCustomerDetailContracts",
  async ({
    page,
    limit,
    // filters,
    id,
  }) => {
    try {
      const result = await fetchService(
        `customer/contracts-info/${id}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          // body: filters,
        }
      );

      return result;
    } catch {
      return {};
    }
  }
);
export default customerDetailContractSlice.reducer;
