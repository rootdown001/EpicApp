import { ReactNode } from "react";

type FormGroupProps = {
  children: ReactNode;
};

export default function FormGroup({ children }: FormGroupProps) {
  return <div>{children}</div>;
}
