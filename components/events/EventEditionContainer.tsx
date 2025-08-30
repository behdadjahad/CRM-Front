import { useFormik } from "formik";

export default function EventEditionContainer() {
  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return <> </>;
}
