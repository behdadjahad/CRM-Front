import { Button } from "../ui/button";

export default function EventEditForm() {
  return (
    <>
      <div className="w-full flex items-center justify-center gap-2">
        <Button variant={"info"}>ذخیره</Button>
        <Button variant={"foreground"}>لغو</Button>
      </div>
    </>
  );
}
