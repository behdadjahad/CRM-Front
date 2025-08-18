import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";

import CustomerInfiniteContainer from "./customer-infinite-container";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

export default function CustomerListSection({
  onCheckCustomerhandler,
  onSendSelectedCustomer,
  multiSelect
}: {
  onCheckCustomerhandler?: any;
    onSendSelectedCustomer?: any;
    
    multiSelect?: boolean;
}) {
  const [searchKeyWord, setSearchKeyWord] = useState<string>("");
  const customerSearchFormik = useFormik({
    initialValues: {
      clientKeyWord: "",
    },
    onSubmit: async () => {},
  });
  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      setSearchKeyWord(keyword);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSearch(customerSearchFormik.values.clientKeyWord);
    return () => debouncedSearch.cancel();
  }, [customerSearchFormik.values.clientKeyWord, debouncedSearch]);

  return (
    <div className="p-4 flex flex-col gap-2">
      <FormMaker
        form={customerSearchFormik}
        fields={[
          {
            key: "clientKeyWord",
            component: "input",
            icon: "/icons/search-icon.png",
            type: "text",
            className: "w-full border border-gray-200 rounded-md h-12 p-0",
          },
        ]}
      />
      <CustomerInfiniteContainer
        onCheckCustomerhandler={onCheckCustomerhandler}
        searchKeyWord={searchKeyWord}
        onSendSelectedCustomer={onSendSelectedCustomer}
        key="notSuggested"
      />
    </div>
  );
}
