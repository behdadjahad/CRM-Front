import { Button } from "../ui/button";
import Image from "next/image";
export default function AddLeadToPipe() {
  return (
    <>
      <Button variant={"foreground"}>
        {" "}
        <Image
          src={"/icons/foreground-plus-icon.svg"}
          alt="plus"
          width={24}
          height={24}
        />
      </Button>
    </>
  );
}
