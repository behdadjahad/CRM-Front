"use client";

import React from "react";
import { BillingContainerProps } from "@/types/billing";
import OrderSummaryCard from "./order-summary-card";
import FeaturesListCard from "./features-list-card";
import DurationSelectionCard from "./duration-selection-card";
import Breadcrumb from "../shared/breadcrumb";


export default function BillingContainer({
    data,
    onDurationChange,
    onPay,
    onFeatureToggle,
    onLoadMoreFeatures,
    onLoadMoreDurations,
    onCloseAllFeatures,
}: BillingContainerProps) {
    const selectedDurationOption = data.durationOptions.find(
        (option) => option.id === data.selectedDuration,

    );
    console.log(data, "88888888888888888888888");
    return (
        <div className=" sm:bg-white  p-6  rounded-xl   " style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.12)' }}>

            {/* Main Content Grid */}

            <div className="grid grid-cols-12 gap-8 justify-center ">


                {/* Right Panel - Features and Duration Selection */}
                <div className="xl:col-span-8 lg:col-span-8 md:col-span-7  col-span-12">
                    {/* Features List Card */}
                    <FeaturesListCard
                        features={data.features}
                        onFeatureToggle={onFeatureToggle}
                        onLoadMore={onLoadMoreFeatures}
                        onCloseAll={onCloseAllFeatures}
                    />

                    {/* Duration Selection Card */}
                    <DurationSelectionCard
                        durationOptions={data.durationOptions}
                        selectedDuration={data.selectedDuration}
                        onDurationChange={onDurationChange}
                        onLoadMore={onLoadMoreDurations}
                    />
                </div>
                {/* Left Panel - Order Summary */}
                <div className="xl:col-span-4 lg:col-span-4  md:col-span-5 col-span-12 ">
                    <OrderSummaryCard
                        packageData={data.package}
                        selectedDuration={selectedDurationOption || null}
                        onPay={onPay}
                    />
                </div>
            </div>

        </div>
    );
}
