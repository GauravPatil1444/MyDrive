import { useState, useEffect } from 'react';
import logo from '../assets/react.svg'
import light from '../assets/brightness.png'
import dark from '../assets/night-mode.png'
import back from '../assets/back.png'
import { Link } from "react-router";
import { useLocation } from "react-router";
import { auth } from '../../firebaseConfig';

function Navbar({heading, setheading, setplaceholder}:any) {
  
    const [togglemode, settogglemode] = useState(true);
    const [profile, setprofile] = useState<any>("");

    const location = useLocation();

    const toggle = ()=>{
        if(togglemode){
            document.documentElement.setAttribute('data-theme','light');
            localStorage.setItem('theme','light');
        }
        else{
            document.documentElement.setAttribute('data-theme','dark');
            localStorage.setItem('theme','dark');
        }
        settogglemode(!togglemode);
    }

    const handleBack = ()=>{
      setheading("MyDrive");
      setplaceholder("MyDrive");
    }
    
    useEffect(() => {
      const theme = localStorage.getItem('theme');
      if(theme=='dark'){
        settogglemode(true);
        document.documentElement.setAttribute('data-theme','dark');
        localStorage.setItem('theme','dark');
      }
      else{
        settogglemode(false);
        document.documentElement.setAttribute('data-theme','light');
        localStorage.setItem('theme','light');
      }
    }, [location])

    useEffect(() => {
      if(auth.currentUser?.photoURL){
        setprofile(auth.currentUser?.photoURL);
      }
    }, [])
    

    return (
    <nav className='p-3 flex shadow-md/20 shadow-sky-300 justify-between fixed w-full'>
        <Link to={heading=="MyDrive"?'/profile':'/'} className='cursor-pointer' onClick={handleBack}>
          <img className='md:ms-10 rounded-full w-8 h-8 object-cover' width={30} src={heading=="MyDrive"||heading=="Authentication"?profile.length!=0?profile:logo:back} alt="Logo" />
        </Link>
        <div className="flex gap-5">
          <Link to={'/'}>
            <p className='text-slate-800 dark:text-white font-medium'>{heading}</p>
          </Link>
        </div>
        <button className='font-medium md:me-10 text-slate-800 dark:text-white cursor-pointer' onClick={toggle}>{togglemode?<img src={light} width={25} alt="Light"/>:<img src={dark} width={25} alt="Dark"/>}</button>
    </nav>
  )
}

export default Navbar