import { useState, useEffect } from 'react';
import logo from '../assets/react.svg'
import light from '../assets/brightness.png'
import dark from '../assets/night-mode.png'
import back from '../assets/back.png'
import { Link } from "react-router";

function Navbar({heading,setheading}:any) {
  
    const [togglemode, settogglemode] = useState(true);

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
    
    useEffect(() => {
      const theme = localStorage.getItem('theme');
      if(theme=='dark'){
        settogglemode(true);
      }
      else{
        settogglemode(false);
      }
    }, [])

    return (
    <nav className='p-3 flex shadow-md/20 shadow-sky-300 justify-between '>
        <button onClick={()=>setheading("MyDrive")}>
          <img className='md:ms-10' width={30} src={heading=="MyDrive"?logo:back} alt="Logo" />
        </button>
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