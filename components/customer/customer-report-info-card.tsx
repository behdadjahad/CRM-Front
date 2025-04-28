import Image from "next/image";

export default function CustomerReportInfoCard({label,value,icon,backgroundColor}:any) {
  return (
    <div className="flex flex-row bg-card rounded-lg p-3 justify-between w-full h-full">
      <div className="flex flex-col justify-around">
        <div className="text-foreground-mute">{label}</div>
        <div className="text-foreground font-bold">{value}</div>
      </div>
          <div className={`flex justify-center items-center bg-red-400 p-0 h-16 w-16 rounded-md  ${backgroundColor}`}>
        <Image
          src={icon}
          alt={"تصویر"}
          width={107}
          height={107}
          className="w-8 h-8"
        />
          </div>
          </div>

  );
}
