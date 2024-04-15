import { FC } from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingPage: FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FaSpinner size={100} className="spinner-icon animate-spin" />
    </div>
  );
};
export default LoadingPage;
