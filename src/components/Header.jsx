import React, { useState, useEffect } from "react";
import MobileHeader from "../components/MobileHeader";
import DesktopHeader from "../components/DesktopHeader";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoVariant = {
    initial: { scale: 1 },
    scrolled: { scale: 0.7 },
  };
  const transition = { type: "spring", stiffness: 300, damping: 30 };
  const headerHeight = scrolled ? 144 : 160;
  const categories = ["SOB ENCOMENDA", "PRONTA ENTREGA", "POR SEMELHANCA"];

  return (
    <>
      <MobileHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrolled={scrolled}
        logoVariant={logoVariant}
        transition={transition}
        categories={categories}
      />
      <DesktopHeader
        scrolled={scrolled}
        logoVariant={logoVariant}
        transition={transition}
        headerHeight={headerHeight}
        categories={categories}
      />
      <div className="pt-32 md:pt-[171px]" />
    </>
  );
}