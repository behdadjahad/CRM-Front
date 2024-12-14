import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import PasswordInput from "../shared/password-input";
import * as Yup from 'yup';

const REQUIERD_TEXT = "این فیلد ضروری است"
export default function LoginForm(){
    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
          validationSchema: Yup.object().shape({
            email: Yup.string().required(REQUIERD_TEXT),
            password: Yup.string().required(REQUIERD_TEXT),
         
          }),
        onSubmit: async () => { }
      })
    return(
        
        <div className="flex flex-col gap-4 w-full">
               <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-gray-900">
                ورود به حساب
              </h1>
              <p className='text-center text-base text-gray-500'>
                مشخصات خود را وارد کنید 
              </p>
        <FormMaker
            form={formik}
            fields={[
              {
                key: 'email',
                component: 'input',
                placeholder:'نام کاربری',
                type: 'email',
                floating: true,
                className: "m-0 w-full",
               
                
              },
              {
                key: 'password',
                component: 'password',
                placeholder:'رمزعبور',
                floating: true,
                className: "m-0 w-full",
               },
           ]} className='flex flex-col w-full' />
        
           
            <div className='flex items-center justify-between p-2'>
                <p className="text-quartiery text-sm">رمز عبور را فراموش کرده ام؟</p>
                <div className='flex items-center gap-2'>
                <label htmlFor="htmlFor" className="text-sm text-quartiery">به یاد داشته باش</label>
                <Checkbox>

                </Checkbox>
                </div>
                

            </div>

             <Button
             type='submit'
              variant={'foreground'}
              className='bg-quartiery-background m-2'
              >
              ورود
            </Button>
            <div className="flex items-center justify-center ">
                <p className="text-sm text-gray-900">حساب کاربری ندارید؟</p>
                <Link href={""} className="text-sm text-quartiery-active">شروع کنید</Link>
            </div>
        </div>
    )

}