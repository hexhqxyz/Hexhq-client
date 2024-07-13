import React from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import ConnectButton from "../ConnectWallet";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-between items-center">
      <div>hello</div>
      <div className="flex items-center">
        <ThemeSwitcher />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
