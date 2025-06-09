import { useEffect, useState } from "react";
import Satisfaction from "../section/satisfaction";
import dynamic from "next/dynamic";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import FormMaker, { OptionType } from "./form-maker";
import { useFormik } from "formik";
import { convertDate, convertToGregorian } from "@/lib/date";
import { getCities, getCountries } from "@/api/location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractCreationInput, createContract } from "@/api/contract";
import { getUsers } from "@/api/auth";

const RatingChart = dynamic(() => import("../shared/rating-chart"), {
  ssr: false,
});

export interface ContractInfoInterface {
  list: {
    label: string;
    value: string;
    score?: any;
  }[];
  contract?: any;
}

export default function ContractInfoContainer({
  list,
  contract,
}: ContractInfoInterface) {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const { mutate: EditContractMutation } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContractCreationInput }) => {
      return createContract(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contract"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      number: contract?.data?.contractNo ?? "",
      date:
        contract?.data?.contractDate && contract?.data?.dateType
          ? convertDate(contract?.data?.contractDate, contract?.data?.dateType)
          : "",
      subject: contract?.data?.contractType?.name ?? "",
      accountant: contract?.data?.userResponsible?.id.toString() ?? "",
      description: contract?.data?.description ?? "",
      country: contract?.data?.destinationCountry?.id.toString() ?? "",
      city: contract?.data?.destinationCity?.id.toString() ?? "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const { data: countryData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => await getCountries(),
  });
  const { data: cityData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => await getCities(),
  });
  useEffect(() => {
    if (countryData && countryData?.data?.length > 0) {
      const countryOptions: OptionType[] = countryData?.data?.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setCountryOptions(countryOptions);
    }
  }, [countryData]);

  useEffect(() => {
    if (cityData && cityData?.data?.length > 0) {
      if (!formik.values.country) {
        const cities: OptionType[] = cityData?.data?.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setCityOptions(cities);
      } else {
        const cities: OptionType[] = cityData?.data
          ?.filter((item) => item.countryId === Number(formik.values.country))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }));
        setCityOptions(cities);
      }
    }
  }, [cityData, formik.values.country]);
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });

  useEffect(() => {
    if (users && users?.data?.length > 0) {
      const userOption: OptionType[] = users.data?.map((item: any) => ({
        label: item.fullName,
        value: item.id.toString(),
      }));
      setUserOptions(userOption);
    }
  }, [users]);
  return (
    <div className="bg-card min-h-fit rounded-bl-xl rounded-br-xl overflow-hidden">
      <div className="opacity-90 p-8 text-primary-foreground flex flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-between w-full md:w-fit items-center">
          {list.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-row md:flex-col   gap-2.5  justify-between  ${
                index === list.length - 2
                  ? "w-full"
                  : "w-full md:w-fit md:items-center"
              } `}
            >
              <span className="text-sm font-normal  text-foreground">
                {item.label}
              </span>
              <div>
                {" "}
                {item?.score ? (
                  <div className="flex gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {`${item?.score?.totalVotes} / ${item?.score?.final}`}
                    </span>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenModal(true);
                      }}
                    >
                      <Image
                        src={"/icons/edit-pen.png"}
                        alt="ادیت"
                        width={16}
                        height={16}
                      />
                    </div>
                    <CustomModal
                      minWidth="0"
                      maxWidth="700px"
                      isOpen={openModal}
                      onRequestClose={() => setOpenModal(false)}
                      contentLabel="رضایت مندی"
                    >
                      <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
                        <span className="text-lg font-bold">
                          نظر خود را ثبت کنید
                        </span>
                        <MdClose
                          size={20}
                          onClick={(e) => {
                            setOpenModal(false);
                            e.stopPropagation();
                          }}
                          className="cursor-pointer"
                        />
                      </div>
                      <Satisfaction
                        onCloseHandler={() => {
                          setOpenModal(false);
                        }}
                        itemId={id}
                        score={item?.score}
                      />
                    </CustomModal>
                    {/* </Link> */}
                  </div>
                ) : (
                  <span className="font-bold text-sm text-foreground">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          ))}
          <Button
            className="text-primary-active border-none"
            onClick={() => {
              setOpenEditModal(true);
            }}
          >
            ویرایش اطلاعات
            <Image
              src={"/icons/edit-primary.png"}
              alt="edit"
              width={1024}
              height={1024}
              className="w-4 h-4"
            />
          </Button>
          <CustomModal
            isOpen={openEditModal}
            onRequestClose={() => setOpenEditModal(false)}
            contentLabel="ویرایش"
          >
            <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
              <span>ویرایش</span>

              <MdClose
                size={20}
                onClick={() => setOpenEditModal(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="w-full flex flex-col items-end">
              <FormMaker
                form={formik}
                fields={[
                  {
                    key: "number",
                    component: "input",
                    placeholder: "شماره قرارداد",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/2",
                    readonly: true,
                    disabled: true,
                  },
                  {
                    key: "date",
                    component: "date",
                    placeholder: "تاریخ قرارداد",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/2",
                  },
                  {
                    key: "subject",
                    component: "input",
                    placeholder: "موضوع قرارداد",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/2",
                    readonly: true,
                    disabled: true,
                  },
                  {
                    key: "accountant",
                    component: "Select",
                    placeholder: "مسئول قرارداد",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/2",
                    options: userOptions,
                  },
                  {
                    key: "country",
                    component: "Select",
                    placeholder: "کشور",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/2",
                    options: countryOptions,
                  },
                  {
                    key: "city",
                    component: "Select",
                    placeholder: "شهر",
                    type: "text",
                    floating: true,
                    className: "w-full md:w-1/2",
                    options: cityOptions,
                  },
                  {
                    key: "description",
                    component: "textarea",
                    placeholder: "توضیحات",
                    type: "text",
                    floating: true,
                    className: "w-full",
                  },
                ]}
                className="flex flex-row w-full"
              />

              <div className="flex flex-row gap-4">
                <Button
                  variant={"info"}
                  onClick={() => {
                    EditContractMutation({
                      id: contract?.data.id,
                      data: {
                        contractTypeId: contract.data.contractType.id,
                        contractDate: convertToGregorian(
                          formik.values.date,
                          contract.data.dateType
                        ),
                        dateType: contract.data.dateType,
                        description: formik.values.description,
                        userSubmitterId: Number(contract.data.userSubmitter.id),
                        userResponsibleId: Number(formik.values.accountant),
                        destinationCityId: Number(formik.values.city),
                        destinationCountryId: Number(formik.values.country),
                      },
                    });
                    setOpenEditModal(false);
                  }}
                >
                  ثبت
                </Button>
                <Button
                  variant={"foreground"}
                  onClick={() => {
                    setOpenEditModal(false);
                    formik.resetForm();
                  }}
                >
                  لغو
                </Button>
              </div>
            </div>
          </CustomModal>
        </div>
      </div>
    </div>
  );
}
