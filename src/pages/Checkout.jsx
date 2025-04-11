import { useContext } from "react";
import { ChevronLeft } from "lucide-react";
import AppContext from "../context/AppContext";

const Checkout = () => {
  const { setActiveTab } = useContext(AppContext);
  return (
    <div>
      <div className="flex items-center">
        <ChevronLeft
          size={24}
          className="text-gray-800 dark:text-gray-200"
          onClick={() => setActiveTab("Home")}
        />
      </div>
    </div>
  );
};

export default Checkout;
