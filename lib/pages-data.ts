export function generatePageAccessData(url?: string) {
  const data = localStorage.getItem("accessData");
console.log(data)
  return data;
}

