import { FC } from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingPage: FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <FaSpinner size={100} className="spinner-icon animate-spin" />
    </div>
  );
};
export default LoadingPage;
