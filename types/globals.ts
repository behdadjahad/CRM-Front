export type StageAction = {
  type: "enter" | "user-recovery" | "user-verification" | "user-reset-password";
};

export interface StageInterface {
  stage: StageAction["type"];
  stageHandler: (type: StageAction["type"]) => any;
  formik: any;
}
