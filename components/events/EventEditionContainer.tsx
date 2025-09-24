import { useFormik } from "formik";
export interface EventEditionContainerInterface {
  eventData: {
    id: number;
  };
}
export default function EventEditionContainer({
  eventData,
}: EventEditionContainerInterface) {
  const formik = useFormik({
    initialValues: {
      id: eventData?.id,
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return <div>ویرایش رویداد</div>;
}
