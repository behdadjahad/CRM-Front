import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";
import {
  ContractState,
  dateType,
  formatPrice,
  limitForCustomerDetailContracts,
  totalVotes,
} from "@/lib/utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface CustomerDetailContractState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  allItems: any[];
  checkedItems: any[];
  total: number;
  limit: number;
}

const initialState: CustomerDetailContractState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  allItems: [],
  checkedItems: [],
  total: 0,
  limit: limitForCustomerDetailContracts,
};
const customerDetailContractSlice = createSlice({
  name: "customerDetailContract",
  initialState: initialState,
  reducers: {
     setCheckedItems(state, action) {
      state.checkedItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAllCustomerDetailContract.fulfilled,
      (state, action) => {
        state.allItems = action.payload.data.map(
          (item: any, index: number) => ({
            "ردیف": index + 1,
            "شماره قرارداد": item?.contractNo,
            "تاریخ قرارداد": (item?.contractDate, item?.dateType)
              ? convertDate(item?.contractDate, item?.dateType)
              : "",
            "میزان درآمد": item?.sellPrice && formatPrice(item?.sellPrice),
            "سود و زیان": item?.profit && formatPrice(item?.profit),
            مقصد: `${item?.destinationCountry?.name ?? ""},${
              item?.destinationCity?.name ?? ""
            }`,
            "موضوع قرارداد": item?.contractType?.name,
            اپراتور: " ",
            وضعیت: ContractState[item?.state as keyof typeof ContractState],
            "تاریخ شروع": (item?.submitDateTime, item?.dateType)
              ? convertDate(item?.submitDateTime, item?.dateType)
              : "",
            "تاریخ پایان": "",
            "تعداد مشتری": item?._count.contractCustomers,
            رضایتمندی: item?.contractSatisfaction[0]?.satisfactionScore
              ? item?.contractSatisfaction[0]?.satisfactionScore / totalVotes
              : 0,
          })
        );
      }
    );
    builder.addCase(fetchCustomerDetailContract.fulfilled, (state, action) => {
      state.currentPage = action.meta.arg.page;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
      state.items = action.payload.data.map((item: any, index: number) => ({
        ردیف: index + 1,
        "شماره قرارداد": item?.contractNo,
        "تاریخ قرارداد": (item?.contractDate, item?.dateType)
          ? convertDate(item?.contractDate, item?.dateType)
          : "",
        "میزان درآمد": item?.sellPrice && formatPrice(item?.sellPrice),
        "سود و زیان": item?.profit && formatPrice(item?.profit),
        مقصد: `${item?.destinationCountry?.name ?? ""},${
          item?.destinationCity?.name ?? ""
        }`,
        "موضوع قرارداد": item?.contractType?.name,
        اپراتور: " ",
        وضعیت: ContractState[item?.state as keyof typeof ContractState],
        "تاریخ شروع": (item?.submitDateTime, item?.dateType)
          ? convertDate(item?.submitDateTime, item?.dateType)
          : "",
        "تاریخ پایان": "",
        "تعداد مشتری": item?._count.contractCustomers,
        رضایتمندی: item?.contractSatisfaction[0]?.satisfactionScore
          ? item?.contractSatisfaction[0]?.satisfactionScore / totalVotes
          : 0,
      }));
      const totalItems = action?.payload?.pagination?.total;
      state.total = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(
        totalItems / limitForCustomerDetailContracts
      );
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
export const fetchAllCustomerDetailContract = createAsyncThunk<any, any>(
  "customerDetailContract/fetchAllCustomerDetailContracts",
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
export const { setCheckedItems } = customerDetailContractSlice.actions;