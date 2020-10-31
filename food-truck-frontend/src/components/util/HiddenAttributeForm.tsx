import { TextField } from "@material-ui/core";
import React from "react";
import Form, { Props as FormProps } from "../Form";

export interface HiddenEntry {
  key: string;
  value: any;
}

export interface HiddenAttributeFormProps {
  hiddenAttrs: HiddenEntry[];
}

class HiddenField extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div />;
  }
}

function HiddenAttributeForm(props: HiddenAttributeFormProps & FormProps) {
  return (
    <Form {...props}>
      {props.hiddenAttrs.map((tpl) => (
        <HiddenField
          key={`hidden${tpl.key}`}
          name={tpl.key}
          defaultValue={tpl.value}
        />
      ))}
    </Form>
  );
}

export default HiddenAttributeForm;
