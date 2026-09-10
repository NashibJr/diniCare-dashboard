import { toast } from "sonner";

export default class Utils {
  public static notify = (
    error?: string,
    message?: string,
    cb?: () => void,
  ) => {
    if (error) {
      toast.error(error ?? "Something went wrong please try again later");
    } else if (message) {
      toast.success(message);
      cb?.();
    } else {
      toast.error("Network error, please try again");
    }
  };

  public static formatMoney = (amount: number) =>
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
}
