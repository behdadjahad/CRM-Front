"use client";
import LeadContainer from "@/components/lead/LeadContainer";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { fetchLeads } from "@/store/lead-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Lead() {
  const dispatch = useDispatch<any>();
  const limit = useSelector((state: any) => state.lead.limit);
  const filters = useSelector((state: any) => state.lead.limit);
  const leadList = useSelector((state: any) => state.lead.items);

  useEffect(() => {
    dispatch(
      fetchLeads({
        page: 1,
        limit: limit,
        filters: filters,
      })
    );
  }, [dispatch]);

 

  return (
    <main className="flex flex-col">
      <Title label="درخواست ها" />

      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "درخواست ها",
          },
        ]}
      />

      <LeadContainer leadList={leadList} />
    </main>
  );
}
