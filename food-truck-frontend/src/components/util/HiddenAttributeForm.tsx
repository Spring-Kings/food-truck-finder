import React from "react";
import Form, {Props as FormProps} from "../Form";

export interface HiddenEntry {
  name: string;
  defaultValue: any;
}

export interface HiddenAttributeFormProps {
  hiddenAttrs: HiddenEntry[];
}

class HiddenField extends React.Component<HiddenEntry> {
  constructor(props: HiddenEntry) {
    super(props);
  }
  render() {
    return <div />;
  }
}

function HiddenAttributeForm(props: HiddenAttributeFormProps & FormProps) {
  return (
    <Form {...props}>
      {React.Children.map(props.children, c => c)}
      {props.hiddenAttrs.map((tpl) => (
        <HiddenField key={`hidden${tpl.name}`} {...tpl} />
      ))}
    </Form>
  );
}

export default HiddenAttributeForm;
