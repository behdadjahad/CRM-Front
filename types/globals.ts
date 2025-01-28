export type StageAction = {
  type: "enter" | "user-recovery" | "user-verification" | "user-reset-password";
};

export interface StageInterface {
  stage: StageAction["type"];
  stageHandler: (type: StageAction["type"]) => any;
  formik: any;
}

export enum clientAddress {
  livingAddress = 1,
  workAddress = 2,

}

export enum CommunicationType {
  mobile = "MOBILE",
  business = "BUSINESS_PHONE",
  home = "HOME_PHONE",
  email = "EMAIL",
  website = "WEBSITE"
}

export enum Communicater {
  organization = "ORGANIZATION",
  home = "HOME",
  business = "BUSINESS",

}