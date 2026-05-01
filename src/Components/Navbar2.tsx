import { useState, useEffect } from 'react';
import logo from '../assets/Logo.png';
import light from '../assets/brightness.png';
import dark from '../assets/night-mode.png';
import back from '../assets/back.png';
import { Link } from "react-router";


function Navbar({heading}:any) {

  const [togglemode, settogglemode] = useState(true);

  const toggle = () => {
    if (togglemode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    settogglemode(!togglemode);
  }

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if(theme=="dark"){
      settogglemode(true);
    }
    else{
      settogglemode(false);
    }
  }, [])
  


  return (
    <nav className='p-3 flex shadow-md/20 shadow-sky-300 justify-between backdrop-blur-sm fixed w-full md:min-w-full'>
      {<Link to={heading=="Profile"?"/":'/auth'} className='cursor-pointer'>
        <img className='md:ms-10 rounded-full w-8 h-8 object-cover'
          width={30}
          src={heading=="Profile"?back:logo}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = logo;
          }}
          alt="Logo"
        /></Link>}
      <div className="flex gap-5">
        <Link to={heading=="Profile"?"/":'/auth'}>
          <p className='text-slate-800 dark:text-white font-medium'>{heading}</p>
        </Link>
      </div>
      <button className='font-medium md:me-10 pe-1 text-slate-800 dark:text-white cursor-pointer' onClick={toggle}>{togglemode ? <img src={light} width={25} alt="Light" /> : <img src={dark} width={25} alt="Dark" />}</button>
    </nav>
  )
}

export default Navbar