import React, { useEffect } from "react";

interface ScrollToEndComponentProps {
  onScrollToEnd: () => void;
  children: React.ReactNode;
}

const ScrollToEndComponent: React.FC<ScrollToEndComponentProps> = ({
  onScrollToEnd,
  children,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = Math.ceil(window.scrollY);
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= docHeight) {
        onScrollToEnd();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollToEnd]);

  return <>{children}</>;
};

export default ScrollToEndComponent;
