import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = ({ scrollRef }) => {
  const location = useLocation();

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

  return null;
};

export default ScrollToTop;
