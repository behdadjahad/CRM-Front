export interface NoDataInterface {
  children?: React.ReactNode;
}

export function NoData({ children = "آیتمی وجود ندارد." }: NoDataInterface) {
  return <div className="bg-gray-300  p-3 rounded-md">{children}</div>;
}
