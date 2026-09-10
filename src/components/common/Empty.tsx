import { Database } from "lucide-react";

const Empty = () => {
  return (
    <div className="flex flex-col gap-1 justify-center items-center my-5">
      <Database color="#aaa" />
      <p className="text-xs text-black/50">No data</p>
    </div>
  );
};

export default Empty;
