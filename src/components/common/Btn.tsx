import { ButtonHTMLAttributes } from "react";
import { Spinner } from "../ui/spinner";
import Button from "../ui/Button";

type BtnTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  isLoading?: boolean;
};

const Btn: React.FC<BtnTypes> = ({ label, isLoading, ...props }) => {
  return (
    <Button
      disabled={props.disabled || isLoading}
      className={
        props.className ??
        `flex items-center justify-center outline-0 rounded-[30px] text-white w-full py-6 font-semibold shrink-0 cursor-pointer hover:bg-[#00bcd4]/60 bg-[#00bcd4]`
      }
      {...props}
    >
      {isLoading && <Spinner color="#fff" />} {label}
    </Button>
  );
};

export default Btn;
