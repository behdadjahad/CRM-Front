export function generateCreationEventForms(leadType: string) {
  switch (leadType) {
    case "phone":
      return {
        fields: [
          {
            key: "title",
            component: "input",
            placeholder: "موضوع تماس",
            type: "text",
            floating: true,
            labelClassName: "w-full",
            className: "w-full md:w-1/2",
          },
        ],
      };
    case "sms":
      return {
        fields: [],
      };
    case "email":
      return {
        fields: [],
      };
  }
}
