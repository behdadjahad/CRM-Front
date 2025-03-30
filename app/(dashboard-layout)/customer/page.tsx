import CustomerContainer from "@/components/customer/customer-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Customer() {
    return (
        <main>
    
              <div>
                <Title label="مشتری" />
      
                <Breadcrumb
                  list={[
                    {
                      label: "داشبورد",
                      link: "/",
                    },
                    {
                      label: "مشتری",
                    },
                  ]}
                />
              </div>
              <CustomerContainer />
       
      </main>

  

  );
}
