import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { FaEllipsisH } from "react-icons/fa";
export interface NotificationCardInterface {
  id: number;
  heading: string;
  user: {
    name: string;
    image: string;
    isOnline: boolean;
  };
  content: string;
  button: {
    className: string;
    title: string;
    variant: any;
  };
  icon: string;
  review: string;
  time: string;
  className: string;
  hasResponse: boolean;
}

export default function NotificationCard({
  id,
  heading,
  user,
  content,
  button,
  icon,
  review,
  time,
  className,
  hasResponse,
}: NotificationCardInterface) {
  return (
    <div className="border-b flex flex-row justify-between items-start gap-2 p-3 w-full">
      <div className="flex flex-col justify-start gap-2">
          <div className="text-xs text-foreground-mute min-w-fit">{time}</div>
        <div className="flex flex-row items-start gap-3">
          <div className="h-12 min-w-12">
            <Image
              src={"/images/user-notification.jpg"}
              alt={"تصویر"}
              width={1024}
              height={1024}
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">{heading}</div>
            <div className="text-sm">{content}</div>
            {hasResponse && (
              <Button className="w-fit" variant={button.variant}>
                {button.title}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-foreground-mute min-w-fit">{time}</div>
        <div>
          <FaEllipsisH />
        </div>
      </div>
    </div>
  );
}
