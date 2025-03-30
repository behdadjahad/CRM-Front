import CustomerTabContainer from "./customer-tab-container";

export default function CustomerContainer() {
  
  return (
      <div className="bg-card h-full rounded-lg">
          
      <CustomerTabContainer tabList={[
        "همه مشتری ها","امروز","5روز آینده","گذشته و رسیدگی نشده"
      ]} />
    </div>
  );
}
