"use client";

import VerificationForm from "@/components/login/verificartion-form";
import Logo from "@/components/shared/logo";
import { useReducer } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import OrganizationInformation from "@/components/login/organization-information";
import { REQUIRED_TEXT } from "@/lib/utils";
import UserRecoveryForm from "@/components/login/user-recovery-form";
import ResetPasswordForm from "@/components/login/reset-password-form";
import { StageAction, StageInterface } from "@/types/globals";

function ForgetPassword() {
  const stageReducer = (
    state: StageInterface,
    action: StageAction
  ): StageInterface => {
    switch (action.type) {
      case "enter":
      case "user-recovery":
      case "user-verification":
      case "user-reset-password":
        return {
          ...state,
          stage: action.type,
        };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };

  const initialState: StageInterface = {
    stage: "user-recovery",
    stageHandler: () => {},
    formik: {},
  };

  const formik = useFormik({
    initialValues: {
      resetEmail: "",
      verification: Array(6).fill(""),
      resetPassword: "",
      retypeResetPassword: "",
    },
    validationSchema: Yup.object().shape({
      resetEmail: Yup.string().required(REQUIRED_TEXT),
      resetPassword: Yup.string().required(REQUIRED_TEXT),
      retypeResetPassword: Yup.string().required(REQUIRED_TEXT),
    }),
    onSubmit: () => {},
  });

  const [state, dispatch] = useReducer(stageReducer, initialState);

  const stageHandler = (type: StageAction["type"]) => {
    dispatch({ type });
  };

  return (
    <div className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 lg:p-28 mr-0  lg:mr-12">
        <Logo
          labelClassName="hidden"
          className="object-contain w-24 h-24 mb-2"
        />

        {state.stage === "user-recovery" && (
          <UserRecoveryForm
            {...initialState}
            stageHandler={stageHandler}
            formik={formik}
          />
        )}

        {state.stage === "user-verification" && (
          <VerificationForm
            {...initialState}
            stageHandler={stageHandler}
            formik={formik}
          />
        )}

        {state.stage === "user-reset-password" && (
          <ResetPasswordForm
            {...initialState}
            stageHandler={stageHandler}
            formik={formik}
          />
        )}
      </div>

      <OrganizationInformation className="w-1/2 hidden lg:block" />
    </div>
  );
}

export default ForgetPassword;
