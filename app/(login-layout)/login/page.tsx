"use client"
import LoginForm from "@/components/login/login-form"
import ResetPasswordForm from "@/components/login/reset-password-form"
import VerificationForm from "@/components/login/verificartion-form"
import Logo from "@/components/shared/logo";
import { useReducer } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import OrganizationInformation from "@/components/login/organization-information";
import { REQUIRED_TEXT } from "@/lib/utils";

type StageAction = {
  type: "enter" | "reset" | "verification";
};

export interface StageInterface {
  stage: StageAction["type"];
  stageHandler: (type: StageAction["type"]) => any;
  formik: any;
}

function stageReducer(
  state: StageInterface,
  action: StageAction
): StageInterface {
  switch (action.type) {
    case "enter":
      return {
        ...state,
        stage: "enter",
      };
    case "reset":
      return {
        ...state,
        stage: "reset",
      };

    case "verification":
      return {
        ...state,
        stage: "verification",
      };
  }
}

const initialState: StageInterface = {
  formik: {},
  stage: "enter",
  stageHandler: () => {},
};

export default function Login() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      resetEmail: "",
      verification: Array(6).fill(""),
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(REQUIRED_TEXT),
      password: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: async () => {},
  });

  const [state, dispatch] = useReducer<
    React.Reducer<StageInterface, StageAction>
  >(stageReducer, initialState);
  function stageHandler(type: StageAction["type"]) {
    dispatch({ type: type });
  }

  return (
    <div className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 lg:p-28 mr-0  lg:mr-12">
        <Logo
          labelClassName="hidden"
          className="object-contain w-24 h-24 mb-2"
        />
        {state.stage == "enter" && (
          <LoginForm
            {...initialState}
            stageHandler={stageHandler}
            formik={formik}
          />
        )}
        {state.stage == "reset" && (
          <ResetPasswordForm
            {...initialState}
            stageHandler={stageHandler}
            formik={formik}
          />
        )}
        {state.stage == "verification" && (
          <VerificationForm
            {...initialState}
            stageHandler={stageHandler}
            formik={formik}
          />
        )}
      </div>

      <OrganizationInformation className="lg:w-1/2 hidden lg:block" />
    </div>
  );
}

