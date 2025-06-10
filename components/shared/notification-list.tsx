import Image from "next/image";
import { Button } from "../ui/button";
export function NotificationList({ list }: { list: any[] }) {
  return (
    <div>
      {list.map((item) => (
        <div key={item.id} className="border-b">
          <div className="flex flex-row gap-2">
            <div className="rounded-full overflow-hidden">
              <Image
                src={"/images/expert.png"}
                alt={"تصویر"}
                width={1024}
                height={1024}
                className="w-12  h-12 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div>{item.header}</div>
              <div>{item.content}</div>
              <Button className="w-fit" variant={item.button.variant}>
                {item.button.title}
              </Button>
            </div>
            <div>more</div>
          </div>
        </div>
      ))}
    </div>
  );
}
