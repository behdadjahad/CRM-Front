import { FormExtenderInterface } from "@/components/shared/form-extender";
import * as Yup from 'yup';

export const PersonalInfoFormExtender: FormExtenderInterface = {
  title: "اطلاعات شخصی",
  fields: [
    {
      key: 'name',
      component: 'input',
      placeholder: 'نام',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'familyName',
      component: 'input',
      placeholder: 'نام خانوادگی',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'birthdate',
      component: 'input',
      placeholder: 'تاریخ تولد',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'socialNumber',
      component: 'input',
      placeholder: 'کد ملی',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'idNumber',
      component: 'input',
      placeholder: 'شماره شناسنامه',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'career',
      component: 'input',
      placeholder: 'شغل',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
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
    name: Yup.string().required('required'),
    familyName: Yup.string().required('required'),
    birthdate: Yup.string().required('required'),
    socialNumber: Yup.string().required('required'),
    idNumber: Yup.string().required('required'),
    career: Yup.string().required('required'),
  })
}

export const ContactInfoFormExtender: FormExtenderInterface = {
  title: "اطلاعات تماس",
  fields: [
    {
      key: 'personalHome',
      component: 'phone',
      placeholder: 'تلفن همراه',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'homePhone',
      component: 'input',
      placeholder: 'شماره تلفن',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'jobPhone',
      component: 'input',
      placeholder: 'تلفن محل کار',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'email',
      component: 'input',
      placeholder: 'ایمیل',
      type: 'email',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'website',
      component: 'input',
      placeholder: 'وب سایت',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
  ],
  initialValues: {
    personalHome: '',
    homePhone: '',
    jobPhone: '',
    email: '',
    website: '',
  },
  validationSchema: Yup.object().shape({
    personalHome: Yup.string().required('required'),
    homePhone: Yup.string().required('required'),
    jobPhone: Yup.string().email().required('required'),
    email: Yup.string().email().required('required'),
    website: Yup.string().required('required'),
  })
}

