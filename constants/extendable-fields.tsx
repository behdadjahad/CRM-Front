import { FormExtenderInterface } from "@/components/shared/form-extender";
import * as Yup from 'yup';

const REQUIERD_TEXT = "این فیلد ضروری است"

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
      component: 'date',
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
    name: Yup.string().required(REQUIERD_TEXT),
    familyName: Yup.string().required(REQUIERD_TEXT),
    birthdate: Yup.string().required(REQUIERD_TEXT),
    socialNumber: Yup.string().required(REQUIERD_TEXT),
    idNumber: Yup.string().required(REQUIERD_TEXT),
    career: Yup.string().required(REQUIERD_TEXT),
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
    personalHome: Yup.string().required(REQUIERD_TEXT),
    homePhone: Yup.string().required(REQUIERD_TEXT),
    jobPhone: Yup.string().email().required(REQUIERD_TEXT),
    email: Yup.string().email().required(REQUIERD_TEXT),
    website: Yup.string().required(REQUIERD_TEXT),
  })
}

export const LivingInformationExtender: FormExtenderInterface = {
  title: "اطلاعات محل سکونت",
  fields: [
    {
      key: 'province',
      component: 'input',
      placeholder: 'استان',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'city',
      component: 'input',
      placeholder: 'شهر',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'street',
      component: 'input',
      placeholder: 'خیابان',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'postalCode',
      component: 'input',
      placeholder: 'کد پستی',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'category',
      component: 'Select',
      placeholder: 'دسته بندی',
      options: [],
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'address',
      component: 'input',
      placeholder: 'آدرس',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2'
    }
  ],
  initialValues: {
    province: '',
    city: '',
    street: '',
    postalCode: '',
    category: '',
    address: '',
  },
  validationSchema: Yup.object().shape({
    province: Yup.string().required(REQUIERD_TEXT),
    city: Yup.string().required(REQUIERD_TEXT),
    street: Yup.string().required(REQUIERD_TEXT),
    postalCode: Yup.string().required(REQUIERD_TEXT),
    category: Yup.string().required(REQUIERD_TEXT),
    address: Yup.string().required(REQUIERD_TEXT),
  })
}

export const workInformationExtender: FormExtenderInterface = {
  title: "اطلاعات محل کار",
  fields: [
    {
      key: 'province',
      component: 'input',
      placeholder: 'استان',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'city',
      component: 'input',
      placeholder: 'شهر',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'street',
      component: 'input',
      placeholder: 'خیابان',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'postalCode',
      component: 'input',
      placeholder: 'کد پستی',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'category',
      component: 'Select',
      placeholder: 'دسته بندی',
      options: [],
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'address',
      component: 'input',
      placeholder: 'آدرس',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2'
    }
  ],
  initialValues: {
    province: '',
    city: '',
    street: '',
    postalCode: '',
    category: '',
    address: '',
  },
  validationSchema: Yup.object().shape({
    province: Yup.string().required(REQUIERD_TEXT),
    city: Yup.string().required(REQUIERD_TEXT),
    street: Yup.string().required(REQUIERD_TEXT),
    postalCode: Yup.string().required(REQUIERD_TEXT),
    category: Yup.string().required(REQUIERD_TEXT),
    address: Yup.string().required(REQUIERD_TEXT),
  })
}

export const organizationInformationExtender: FormExtenderInterface = {
  title: "اطلاعات محل کار",
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
      key: 'category',
      component: 'Select',
      placeholder: 'دسته بندی',
      options: [
        {
          label: "hi",
          value: "hi"
        }
      ],
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2 lg:w-1/4'
    },
    {
      key: 'address',
      component: 'input',
      placeholder: 'آدرس',
      type: 'text',
      floating: true,
      labelClassName: "w-full",
      className: 'w-full md:w-1/2'
    }
  ],
  initialValues: {
    name: '',
    category: '',
    address: '',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(REQUIERD_TEXT),
    category: Yup.string().required(REQUIERD_TEXT),
    address: Yup.string().required(REQUIERD_TEXT),
  })
}

