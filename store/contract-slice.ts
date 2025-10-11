import { fetchService } from "@/boot/fetch-service";
import { services } from "@/constants/services";
import { convertDate } from "@/lib/date";
import {
  formatPrice,
  limitForContracts,
  ServerImageAddress,
  totalVotes,
} from "@/lib/utils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ContractState {
  items: any[];
  tableData: { id: number; list: { label: string; value: string }[] }[];
  currentPage: number;
  totalPages: number;
  filters: any;
  ContractOverviewList: {
    label: string;
    value: number;
  }[];
  limit: number;
  scrollPosition: number;
  allItems: any[];
  total: number;
  checkedItems: any[];
  dateTimeRange: {
    start: string;
    end: string;
  };
}

const initialState: ContractState = {
  items: [],
  tableData: [],
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
  allItems: [],
  total: 0,
  checkedItems: [],
  dateTimeRange: {
    start: "",
    end: "",
  },
};

const contractSlice = createSlice({
  name: "contract",
  initialState: initialState,
  reducers: {
    setCheckedItems(state, action) {
      state.checkedItems = action.payload;
    },
    setScrollPosition(state, action: PayloadAction<number>) {
      state.scrollPosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllContracts.fulfilled, (state, action) => {
      state.allItems = action?.payload?.data?.map(
        (item: any, index: number) => ({
          id: item.id,
          ردیف: index + 1,
          "تاریخ قرارداد":
            item?.contractDate && item?.dateType
              ? convertDate(item?.contractDate, item?.dateType)
              : "",
          مقصد: item?.destinationCountry?.name ?? "",
          "ثبت کننده": item?.userSubmitter?.fullName ?? "",
          رضایتمندی: item?.contractSatisfaction[0]?.satisfactionScore
            ? item?.contractSatisfaction[0]?.satisfactionScore
            : 0,
          "نوع قرارداد": item?.contractType?.name,
          مشتری:
            item?.mainCustomerSoldto?.person?.firstName &&
            item?.mainCustomerSoldto?.person?.lastName
              ? item?.mainCustomerSoldto?.person?.firstName +
                " " +
                item?.mainCustomerSoldto?.person?.lastName
              : "",
        })
      );
    });
    builder.addCase(fetchContracts.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.items = action?.payload?.data?.map((item: any, index: number) => ({
        id: item.id,
        contract: {
          date:
            item?.contractDate && item?.dateType
              ? convertDate(item?.contractDate, item?.dateType)
              : "",
          destination: item?.destinationCountry?.name ?? "",
          submitter: item?.userSubmitter?.fullName ?? "",
          unit: item?.contractCurrency?.name,
          customer: {
            name:
              item?.mainCustomerSoldto?.person?.firstName &&
              item?.mainCustomerSoldto?.person?.lastName
                ? item?.mainCustomerSoldto?.person?.firstName +
                  " " +
                  item?.mainCustomerSoldto?.person?.lastName
                : "",
            image:
              item?.mainCustomerSoldto?.person?.avatar &&
              ServerImageAddress + item?.mainCustomerSoldto?.person?.avatar,
          },
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
            ? item?.contractSatisfaction[0]?.satisfactionScore
            : 0,
          scoreInPercent: item?.contractSatisfaction?.[0]?.satisfactionScore
            ? (item?.contractSatisfaction?.[0]?.satisfactionScore * 100) / 10
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
        exportData: {
          id: item.id,
          ردیف: index + 1,
          "نام ونام خانوادگی":
            item?.mainCustomerSoldto?.person?.firstName &&
            item?.mainCustomerSoldto?.person?.lastName
              ? item?.mainCustomerSoldto?.person?.firstName +
                " " +
                item?.mainCustomerSoldto?.person?.lastName
              : "",

          "تاریخ قرارداد":
            item?.contractDate && item?.dateType
              ? convertDate(item?.contractDate, item?.dateType)
              : "",
          مقصد: item?.destinationCountry?.name ?? "",
          "ثبت کننده": item?.userSubmitter?.fullName ?? "",
          رضایتمندی: item?.contractSatisfaction[0]?.satisfactionScore
            ? item?.contractSatisfaction[0]?.satisfactionScore
            : 0,
          "نوع قرارداد": item?.contractType?.name,
        },
      }));
      state.tableData = data.map((contract:any) => ({
        id: contract?.id,
        list: [
          {
            label: "نام و نام خانوادگی",
            value:
              contract?.mainCustomerSoldto?.person?.firstName &&
              contract?.mainCustomerSoldto?.person?.lastName
                ? contract?.mainCustomerSoldto?.person?.firstName +
                  " " +
                  contract?.mainCustomerSoldto?.person?.lastName
                : "",
          },
        ],
      }));
      state.ContractOverviewList = [
        {
          label: " قرار داد کل",
          // value: (action?.payload?.doneCount && action?.payload?.inProgressCount) ? (action?.payload?.doneCount + action?.payload?.inProgressCount) : "",
          value:
            (action?.payload?.meta?.doneCount ?? 0) +
            (action?.payload?.meta?.inProgressCount ?? 0) +
            (action?.payload?.meta?.initialCount ?? 0),
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
      state.total = action?.payload?.pagination?.total;
      state.currentPage = action.meta.arg.page;
      const filters = action.meta.arg.filters;
      state.filters = filters;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
      state.dateTimeRange.start = action?.payload?.meta?.startRangeTime;
      state.dateTimeRange.end = action?.payload?.meta?.endRangeTime;
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
export const fetchAllContracts = createAsyncThunk<any, any>(
  "contract/fetchAllContracts",
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
export const { setScrollPosition, setCheckedItems } = contractSlice.actions;
