"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";

import SortDropDown from "../shared/sort-drop-down";

import FilterDrawer from "./filter-drawer";
import { OptionType } from "../shared/form-maker";

export default function FilterContainer({
  onFilterHandler,
  rangeItems,
  filterItems,
  sortList,
  onSortHandler,
  onCancleHandler
}: {
  onFilterHandler?: any;
  rangeItems: any[];
  filterItems: any[];
  sortList?: OptionType[];
  onSortHandler:any;
  onCancleHandler:any;
}) {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="flex items-center gap-4 text-sm">
      <Button
        onClick={() => setOpenFilter(true)}
        variant={"foreground"}
        className="flex items-center gap-2 border"
      >
        <Image src={"/icons/filter.png"} alt="Filter" width={1024} height={1024} className="w-5 h-5"/>

        <span>فیلتر</span>
      </Button>

      {/* <Button variant={"ghost"} className='flex items-center gap-2'>
        <Image src={'/icons/sort-ascending.png'} alt='Sort' width={24} height={24} />

        <span>
          مرتب سازی بر اساس
        </span>
      </Button> */}
      {sortList && sortList.length > 0  && <SortDropDown list={sortList} onSortHandler={onSortHandler}/>}

      <FilterDrawer
        setState={setOpenFilter}
        state={openFilter}
        filterItems={filterItems}
        rangeItems={rangeItems}
        onFilterHandler={() => {
          onFilterHandler()
          setOpenFilter(false)
        }}
        onCancleHandler=
          {() => {
            onCancleHandler()
            setOpenFilter(false)
          }}


      />
    </div>
  );
}
