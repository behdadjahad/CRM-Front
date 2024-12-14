import { useFormik } from "formik"
import FormMaker from "../shared/form-maker"
import { Button } from "../ui/button"
import Link from "next/link"
import * as Yup from 'yup';

const REQUIERD_TEXT = "این فیلد ضروری است"
export default function ResetPasswordForm() {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(REQUIERD_TEXT),
    }),
    onSubmit: async () => { }
  })
  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-center text-2.5xl md:text-3xl font-primary-bold leading-9 text-gray-900">
        بازیابی رمز عبور
      </h1>
      <p className='text-center text-base text-gray-500'>
        برای دریافت کد لطفا شماره همراه یا ایمیل خود را وارد کنید
      </p>

      <FormMaker
        form={formik}
        fields={[
          {
            key: 'email',
            component: 'input',
            placeholder: 'ایمیل یا شماره همراه',
            type: 'email',
            floating: true,
            className: "w-full",
          },
        ]}
        className='flex flex-col w-full mt-8' />
      <Button
        type='submit'
        variant={"foreground"}
        className="bg-quartiery-background m-2"
      >
        ارسال کد تایید
      </Button>
      <Link href="" className="text-center">بازگشت</Link>
    </div>

  )
}