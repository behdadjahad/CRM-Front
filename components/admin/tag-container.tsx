import TagCard from "./tag-card";
export interface TagContainerInterface {
  list:{label:string,value:number}[];
  onDeleteHandler: (itemId: number) => void;
}
export default function TagContainer({
  list,
  onDeleteHandler,
}: TagContainerInterface) {
  return (
    <div className="flex flex-wrap gap-2">
      {list && list?.map((item, index) => (
        <TagCard
          {...item}
          key={index}
          onDeleteHandler={(itemId:number ) => {
            onDeleteHandler(itemId);
          }}
        />
      ))}
    </div>
  );
}
