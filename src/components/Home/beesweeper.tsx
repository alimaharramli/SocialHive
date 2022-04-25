import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { useStore } from "../../store";
import React, { useRef, useState } from 'react'
interface GameProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const BeeSweeper: FC<GameProps> = ({ isOpened, setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);
  const formRef = useRef()
  return (
    <div
      onClick={() => setIsOpened(false)}
      className={` fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
    <div className="centre flex h-screen" onClick={(e) => e.stopPropagation()}>
    <div className="m-auto" id="hive"></div>
    <div id="score"></div>
    </div>
    
    </div>
  );
};

export default BeeSweeper;
