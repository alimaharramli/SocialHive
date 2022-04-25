import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { useStore } from "../../store";
import { Form, Button} from 'react-bootstrap'
import React, { useRef, useState } from 'react'
interface UserInfoProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const UserInfo: FC<UserInfoProps> = ({ isOpened, setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);
  const formRef = useRef()
  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-dark mx-2 w-full max-w-[500px] rounded-lg"
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl text-yellow-400 text-b">
              Your Profile
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={IMAGE_PROXY(currentUser?.photoURL as string)}
              alt=""
            />
            
            <div>
              <h1 className="text-xl text-yellow-400">{currentUser?.displayName}</h1>
              <p>ID: {currentUser?.uid}</p>
              <p>Email: {currentUser?.email || "None"}</p>
              <p>Phone Number: {currentUser?.phoneNumber || "None"}</p>
            
            </div>
            
            
          </div>
          <div className="p-6">
            <Form className="w-full max-w-sm">
              <Form.Group id="name" className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <Form.Label className="block text-yellow-400 font-bold md:text-right mb-1 md:mb-0 pr-4">Name</Form.Label>
                  </div>
                  <div className="md:w-2/3">
                    <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-300" type="name"  />
                  </div>
              </Form.Group>
              <Form.Group id="email" className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <Form.Label className="block text-yellow-400 font-bold md:text-right mb-1 md:mb-0 pr-4">Email</Form.Label>
                  </div>
                  <div className="md:w-2/3">
                    <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-300" type="email" />
                  </div>
              </Form.Group>
              <Form.Group id="cur-password" className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <Form.Label className="block text-yellow-400 font-bold md:text-right mb-1 md:mb-0 pr-4">Current Password</Form.Label>
                  </div>
                  <div className="md:w-2/3">
                    <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-300" type="password" />
                  </div>
              </Form.Group>
              <Form.Group id="password" className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <Form.Label className="block text-yellow-400 font-bold md:text-right mb-1 md:mb-0 pr-4">New Password</Form.Label>
                  </div>
                  <div className="md:w-2/3">
                    <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-300" type="password"  placeholder="Leave blank to keep the same"/>
                  </div>
              </Form.Group>
              <Form.Group id="password-confirm" className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <Form.Label className="block text-yellow-400 font-bold md:text-right mb-1 md:mb-0 pr-4">Password Confirmation</Form.Label>
                  </div>
                  <div className="md:w-2/3">
                    <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-300" type="password"  placeholder="Leave blank to keep the same"/>
                  </div>
              </Form.Group>
              <Button  className="shadow bg-yellow-400 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">Submit</Button>
                </Form>
            
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default UserInfo;