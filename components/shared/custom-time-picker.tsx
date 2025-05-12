import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

export default function CustomTimePicker({
  value,
  onValueChanged,
  children,
  placeholder = "ساعت را انتخاب کنید",
}: {
  value: string | null; // expect "HH:mm"
  onValueChanged: (val: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) {
  const pad = (num: number) => String(num).padStart(2, "0");

  // Use default "00:00" if value is null/empty
  const parseTime = (val: string | null) => {
    const timeStr = val && val.includes(":") ? val : "00:00";
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    return new DateObject().set({ hour, minute });
  };

  return (
    <DatePicker
      format="HH:mm"
      value={parseTime(value)}
      disableDayPicker
      plugins={[
        <TimePicker key="time" position="top" format="HH:mm" hideSeconds />,
      ]}
      onChange={(date: any) => {
        const formattedTime = `${pad(date.hour)}:${pad(date.minute)}`;
        onValueChanged(formattedTime);
      }}
      render={(val, openCalendar) => (
        <div className="w-full">
          <div className="cursor-pointer" onClick={openCalendar}>
            {children}
          </div>
          <input
            type="text"
            readOnly
            value={value || "00:00"}
            placeholder={placeholder}
            className="hidden"
          />
        </div>
      )}
    />
  );
}
