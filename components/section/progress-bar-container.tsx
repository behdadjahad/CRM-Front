export function ProgressBarContainer({ data }: { data: any[] }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item: any, index: number) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex flex-row justify-between w-full">
            <div className="text-xs">{item.label}</div>
            <div className="flex gap-1">
              <span className="text-xs text-foreground-mute">
                ({`${item.valueInPercent}%`})
              </span>
              <span className="text-xs">{item.value}</span>
            </div>
          </div>
          <div
            className="h-1.5 rounded-sm overflow-hidden mt-1"
            style={{
              backgroundColor: "#F0F4F8",
            }}
          >
            <div
              className="h-full rounded-sm"
              style={{
                width: `${item.valueInPercent}%`,
                backgroundColor: item.fill,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
