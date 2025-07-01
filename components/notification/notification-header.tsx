import { readAllNotification } from "@/api/notification";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";

interface NotificationHeaderInterface {
title: string;
 action: {
    title: string;
  };
  onReadHandler:()=>any
}
export default function NotificationHeader({
  title,
  action,
  onReadHandler
}: NotificationHeaderInterface) {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between p-3">
        {" "}
        <span className="font-bold text-base">{title}</span>
        <Button
          className="text-primary-active teaxt-sm"
          onClick={onReadHandler}
          variant={'transparent'}
        >
          {action.title}
        </Button>
      </div>
    </div>
  );
}
