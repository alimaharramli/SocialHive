import { FC } from "react";
import { useStore } from "../../store";
import React, { useRef, useState } from 'react';
import { Form, Button,Alert} from 'react-bootstrap';
import {auth} from "../../shared/firebase";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {error_codes} from "../../shared/constants";
interface SignInWithEmailProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;    
}


const SignInWithEmail: FC<SignInWithEmailProps> = ({ isOpened, setIsOpened }) => {
    const currentUser = useStore((state) => state.currentUser);
    const formRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e : any){
        e.preventDefault()
        localStorage.removeItem("VerifyMail")
        localStorage.removeItem("VerifyMail")

        setLoading(true)  // Page is in loading mode until process is handled
        await signInWithEmailAndPassword(auth,emailRef.current.value, passwordRef.current.value).then(function(value){
            if(!value.user.emailVerified){
                localStorage.setItem("VerifyEmail", `"${value.user.displayName}. You haven't verified your email yet. Please check your email for verification link.`)
                signOut(auth)
            }
        }).catch((error) => {
            var errorCode = error.code;
            setError(error_codes[errorCode as keyof typeof error_codes])
        });
        
        setLoading(false) // Process is finished. Page is back to the normal state
    }

    return (
        <div
        onClick={() => {formRef.current.reset(),setError(''),setIsOpened(false)}}
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
                Sign In
                </h1>
            </div>
            <div className="flex flex-1 items-center justify-end">
                <button
                onClick={() =>  {formRef.current.reset(),setError(''),setIsOpened(false)}}
                className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
                >
                <i className="bx bx-x text-2xl"></i>
                </button>
            </div>
            </div>
            <div className="p-6">
            {error &&<div id="alert-2" className="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                <svg className="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <div className="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                {error}
                </div>
                <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300" data-dismiss-target="#alert-2" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
                </div>}
            
            <Form className="w-full max-w-sm" ref={formRef} onSubmit={handleSubmit}>
                <Form.Group className="md:flex md:items-center mb-6" id="email">
                    <div className="md:w-1/3">
                        <Form.Label className="block text-white-500 md:text-right mb-1 md:mb-0 pr-4" >Email</Form.Label>
                    </div>
                    <div className="md:w-2/3">
                        <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="email" ref={emailRef} required/>
                    </div>
                </Form.Group>
                <Form.Group className="md:flex md:items-center mb-6" id="password">
                    <div className="md:w-1/3">
                        <Form.Label className="block text-white-500 md:text-right mb-1 md:mb-0 pr-4" >Password</Form.Label>
                    </div>
                    <div className="md:w-2/3">
                        <Form.Control className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="password" ref={passwordRef} required/>
                    </div>
                </Form.Group>
                <div className="md:flex md:items-center">
                <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <Button disabled={loading}  className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">Log In</Button>
                    </div>
                </div>
            </Form>
            
            <p className="mt-4 text-gray-400">
                <a href="#" className="text-white"/>
            </p>
            </div>
        </div>
        </div>
    );
};

export default SignInWithEmail;