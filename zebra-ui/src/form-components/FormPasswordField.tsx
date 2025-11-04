"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormTextField from "./FormTextField";

type Props = Omit<
  React.ComponentProps<typeof FormTextField>,
  "type" | "suffix"
> & {
  toggleAriaLabel?: string;
};

export default function FormPasswordField({
  toggleAriaLabel = "Toggle password visibility",
  ...rest
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <FormTextField
      {...rest}
      type={show ? "text" : "password"}
      suffix={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          onMouseDown={(e) => e.preventDefault()}
          tabIndex={-1}
          aria-label={toggleAriaLabel}
          className="inline-flex items-center"
        >
          {show ? <Eye /> : <EyeOff />}
        </button>
      }
    />
  );
}
