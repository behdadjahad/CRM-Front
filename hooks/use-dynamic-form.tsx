import { useFormik, FormikProps } from 'formik';
import { useState } from 'react';

export function useDynamicForms(
  initialValues: any,
  validationSchema: any
): [FormikProps<any>[], () => void, (index: number) => void] {
  const [forms, setForms] = useState<FormikProps<any>[]>([
    useFormik({
      initialValues: { ...initialValues },
      validationSchema,
      onSubmit: () => { },
    }),
  ]);

  // Add a new form instance
  const addForm = () => {
    const newForm = useFormik({
      initialValues: { ...initialValues },
      validationSchema,
      onSubmit: () => { },
    });
    setForms((prevForms) => [...prevForms, newForm]);
  };

  // Remove a form instance by index
  const removeForm = (index: number) => {
    setForms((prevForms) => prevForms.filter((_, i) => i !== index));
  };

  return [forms, addForm, removeForm];
}
