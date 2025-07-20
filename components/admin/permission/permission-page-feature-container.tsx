import { Button } from "@/components/ui/button";

import PermissionPageSubTable from "../tables/permission-page-sub-table";
interface PermissionPageFeatureContainerInterface {
  pageList: any[];
}
export default function PermissionPageFeatureContainer({
  pageList,
}: PermissionPageFeatureContainerInterface) {
    
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>لیست صفحات</div>
        <Button
          className="border-none flex justify-end w-fit"
          variant={"info"}
          onClick={() => {}}
        >
          اعمال تغییرات
        </Button>
      </div>

      <PermissionPageSubTable pageList={pageList} />
    </div>
  );
}
