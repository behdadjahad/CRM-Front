import { FormExtenderInterface } from "@/components/shared/form-extender";
import * as Yup from 'yup';

export const PersonalInfoFormExtender: Partial<FormExtenderInterface> = {
  fields: [
    {
      key: 'name',
      component: 'input',
      placeholder: 'نام',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'col-span-12 md:col-span-6 lg:col-span-3'
    },
    {
      key: 'familyName',
      component: 'input',
      placeholder: 'نام خانوادگی',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'col-span-12 md:col-span-6 lg:col-span-3'
    },
    {
      key: 'birthdate',
      component: 'input',
      placeholder: 'تاریخ تولد',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'col-span-12 md:col-span-6 lg:col-span-3'
    },
    {
      key: 'socialNumber',
      component: 'input',
      placeholder: 'کد ملی',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'col-span-12 md:col-span-6 lg:col-span-3'
    },
    {
      key: 'idNumber',
      component: 'input',
      placeholder: 'شماره شناسنامه',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'col-span-12 md:col-span-6 lg:col-span-3'
    },
    {
      key: 'career',
      component: 'input',
      placeholder: 'شغل',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'col-span-12 md:col-span-6 lg:col-span-3'
    }
  ],
  initialValues: {
    name: '',
    familyName: '',
    birthdate: '',
    socialNumber: '',
    idNumber: '',
    career: '',
  },
  validationSchema: Yup.object().shape({
    firstName: Yup.string().required('required'),
    lastName: Yup.string().required('required'),
    email: Yup.string().email().required('required'),
    description: Yup.string().required('required'),
  })
}

