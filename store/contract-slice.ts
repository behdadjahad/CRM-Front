import { fetchService } from "@/boot/fetch-service";
import { services } from "@/constants/services";
import { convertDate } from "@/lib/date";
import {
  formatPrice,
  limitForContracts,
  ServerImageAddress,
  totalVotes,
} from "@/lib/utils";
import { createSlice, createAsyncThunk,PayloadAction  } from "@reduxjs/toolkit";

export interface ContractState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  ContractOverviewList: {
    label: string;
    value: number;
  }[];
  limit: number;
  scrollPosition: number;
}

const initialState: ContractState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  ContractOverviewList: [
    { label: " قرار داد کل", value: 0 },
    { label: "قرار داد تکمیل شده", value: 0 },
    { label: " قرار داد ناقص", value: 0 },
  ],
  limit: limitForContracts,
  scrollPosition: 0,
};

const contractSlice = createSlice({
  name: "contract",
  initialState: initialState,
  reducers: {
    //  setData(state, action: PayloadAction<any>) {
    //     state.filters = action.payload;
    //     console.log(action.payload);
    //     state.currentPage = 1;
    //   },
    setScrollPosition(state, action: PayloadAction<number>) {
      state.scrollPosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContracts.fulfilled, (state, action) => {
      state.items = action?.payload?.data?.map((item: any) => ({
        id: item.id,
        contract: {
          date:
            item?.contractDate && item?.dateType
              ? convertDate(item?.contractDate, item?.dateType)
              : "",
          destination: item?.destinationCountry?.name ?? "",
          submitter: item?.userSubmitter?.fullName ?? "",
          unit: item?.contractCurrency?.name,
          customer:
            item?.mainCustomerSoldto?.person?.firstName &&
            item?.mainCustomerSoldto?.person?.lastName
              ? item?.mainCustomerSoldto?.person?.firstName +
                " " +
                item?.mainCustomerSoldto?.person?.lastName
              : "",
        },
        footer: {
          // cost: item?.buyPrice ? item?.buyPrice : 0,
          cost: item?.buyPrice,
          // income: item.sellPrice ? item?.sellPrice : 0,
          income: item?.sellPrice,
          // overall:
          //   item?.sellPrice && item?.buyPrice
          //     ? item.sellPrice - item.buyPrice
          //     : 0,
          overall: item?.sellPrice - item?.buyPrice,
        },
        header: {
          contractNumber: item.contractNo,
          icon:
            item?.contractType?.iconFile &&
            ServerImageAddress + item?.contractType?.iconFile,
          submitDate:
            item?.submitDateTime && item?.dateType
              ? convertDate(item?.submitDateTime, item?.dateType)
              : "",
          title: item?.contractType?.name,
        },
        score: {
          id: item?.contractSatisfaction[0]?.id,
          isSubmitted: item?.contractSatisfaction[0]?.satisfactionScore
            ? true
            : false,
          final: item?.contractSatisfaction[0]?.satisfactionScore
            ? (item?.contractSatisfaction[0]?.satisfactionScore * 100) /
              totalVotes
            : 0,
          totalVotes: totalVotes,
        },
        services: item.avServices
          ? services.filter((obj) => item.avServices.includes(obj.name))
          : [],
        user: {
          image: "/images/expert.png",
          name: item?.userResponsible?.fullName,
        },
      }));
      state.ContractOverviewList = [
        {
          label: " قرار داد کل",
          // value: (action?.payload?.doneCount && action?.payload?.inProgressCount) ? (action?.payload?.doneCount + action?.payload?.inProgressCount) : "",
          value:
            (action?.payload?.meta?.doneCount ?? 0) +
            (action?.payload?.meta?.inProgressCount ?? 0),
        },
        {
          label: "قرار داد تکمیل شده",
          value: action?.payload?.meta?.doneCount ?? "",
        },
        {
          label: " قرار داد ناقص",
          value: action?.payload?.meta?.inProgressCount ?? "",
        },
      ];
      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(
        totalItems / action?.payload?.pagination?.limit
      );
      state.currentPage = action.meta.arg.page;
      const filters = action.meta.arg.filters;
      state.filters = filters;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
    });
  },
});

export const fetchContracts = createAsyncThunk<any, any>(
  "contract/fetchContracts",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `contract-chadco-customer/filter-contracts?page=${page}&limit=${limit}`,
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
export default contractSlice.reducer;
export const { setScrollPosition } = contractSlice.actions;