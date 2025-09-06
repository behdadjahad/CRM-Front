export function generatePageAccessData(pageCode: any) {

const accessData = localStorage.getItem("accessData");
if (accessData) {
    const matchPage = JSON.parse(accessData)?.pages?.find(
      (item: any) => pageCode in item
    );
    return matchPage ? matchPage[pageCode] : undefined;
  } else return null;
}
