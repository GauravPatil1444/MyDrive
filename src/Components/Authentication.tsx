import { useState } from "react";
import Navbar from "./Navbar";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../firebaseConfig'
import loader from '../assets/loading.png'

function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(false);

    const handleLogin = async () => {
        try {
            setloading(true);
            const credential = await signInWithEmailAndPassword(auth, email, password);
            // console.log(credential.user);
            localStorage.setItem('user',JSON.stringify(credential.user.uid));
            if(credential.user.photoURL){
                localStorage.setItem('profile', credential.user.photoURL);
            }
            setloading(false);
            window.location.assign('/');
        }
        catch {
            seterror(true);
            setloading(false);
        }
    }

    const handleSignin = async () => {
        try {
            setloading(true);
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const user = credential.user;
            localStorage.setItem('user',JSON.stringify(user.uid));
            await updateProfile(user, { 
                displayName: name,
            });
            setloading(false);
            window.location.assign('/');
        }
        catch {
            seterror(true);
            setloading(false);
        }
    }

    const handleSubmit = () => {
        if (isLogin) {
            // console.log("Login:", { email, password });
            handleLogin();
        } else {
            // console.log("Signup:", { name, email, password });
            handleSignin();
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-800">

                <p id="font-mea" className="pt-26 p-10 text-6xl font-bold animate-pulse mx-auto bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 bg-clip-text text-transparent ">{isLogin ? "Welcome Back" : "Get Started"}</p>

                <div className="w-[90%] md:w-[400px] mx-auto p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900">

                    <h2 className="text-2xl font-semibold text-center mb-6 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {isLogin ? "Login" : "Create Account"}
                    </h2>

                    <div className="flex flex-col gap-4">

                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-2 border border-sky-400 rounded outline-none dark:text-white bg-transparent"
                            />
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border border-sky-400 rounded outline-none dark:text-white bg-transparent"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border border-sky-400 rounded outline-none dark:text-white bg-transparent"
                        />

                        {error && (
                            <p className="text-red-500 animate-bounce text-center mt-2">
                                Invalid email or password!
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="cursor-pointer mt-2 flex justify-center bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
                        >
                            {loading?<img className="animate-spin" width={25} src={loader} alt="Loading..." />:isLogin ? "Login" : "Create Account"}
                        </button>
                    </div>

                    <p className="text-center mt-4 text-sm dark:text-gray-300">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 cursor-pointer text-sky-400 font-medium"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Authentication;