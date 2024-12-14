import { useFormik } from "formik"
import FormMaker from "../shared/form-maker"
import { Button } from "../ui/button"
import Link from "next/link"
import VerificationCode from "../shared/verification-input"


export default function VerificationForm(){
    const formik = useFormik({
        initialValues: {
          verification: Array(6).fill("")
         },
        onSubmit: async () => { }
      })
    return(
        <div className="w-full flex flex-col gap-4 items-center">
             
             <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-gray-900">
          
             تایید کد 
      
           </h1>
              <p className='text-center text-base text-gray-500'>
              ما یک کد تأیید 6 رقمی را به <span>chadko@gmail.com</span> ارسال کرده‌ایم، لطفاً کد را در کادر زیر وارد کنید.
              </p>
             
             {/*<VerificationCode />*/} 
              <FormMaker
                         form={formik}
                         fields={[
                           {
                             key: 'verification',
                             component: 'verification',
                             maxLength:6
                          },
                          
                        ]}/>
                
                
    
                <p className="text-blue-800"><span>1</span>:<span>59</span><span className="text-quartiery-foreground">تا ارسال مجدد کد</span></p>
               <Button
               type='submit'
                variant={"foreground"}
                className='w-full bg-quartiery-background m-2'
                >
                ثبت
              </Button>
              <Link href="" className="text-center text-gray-900">بازگشت</Link>
              </div>


    )
}