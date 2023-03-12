import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`input input-bordered ${props.className}`} />
  );
}
