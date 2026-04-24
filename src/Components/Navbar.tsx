import { useState, useEffect, useContext } from 'react';
import logo from '../assets/Logo.png';
import light from '../assets/brightness.png';
import dark from '../assets/night-mode.png';
import back from '../assets/back.png';
import { Link } from "react-router";
import { useLocation } from "react-router";
import { MainContext } from './Main';

function Navbar() {

  const [togglemode, settogglemode] = useState(true);
  const [profile, setprofile] = useState<any>("");

  const {
    setplaceholder,
    heading,
    setheading,
    fileStack,
    setfileStack,
    viewFile,
    setviewFile,
    itemClick
  } = useContext(MainContext) as any;

  const location = useLocation();

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

  const handleBack = () => {
    setheading("MyDrive");
    setplaceholder("MyDrive");
    setviewFile(false); 
  }

  const handleGoback = () => {
    // console.log(`${fileStack.split(`/${heading}`)[0].split('/')[fileStack.split(`/${heading}`)[0].split('/').length-1]}`);
    const newarr = fileStack.split('/').filter((item: any) => {
      return item != heading
    })
    const newFileStack = newarr.join('/');
    setfileStack(newFileStack);
    itemClick({ id: "1444", type: "folder", name: newFileStack });
  }

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme == 'dark') {
      settogglemode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    else {
      settogglemode(false);
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [location])

  useEffect(() => {
    const url: any = localStorage.getItem('profile');
    setprofile(url);
  }, [])


  return (
    <nav className='p-3 flex shadow-md/20 shadow-sky-300 justify-between backdrop-blur-sm fixed w-full md:min-w-full'>
      {heading == "MyDrive" || heading == "Profile" || viewFile ? <Link to={heading == "MyDrive" ? '/profile' : '/'} className='cursor-pointer' onClick={handleBack}>
        <img className='md:ms-10 rounded-full w-8 h-8 object-cover'
          width={30}
          src={heading == "MyDrive" ? profile || logo : heading == "Authentication" ? logo : back}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = logo;
          }}
          alt="Logo"
        />
      </Link> :
        <button className='cursor-pointer' onClick={handleGoback}>
          <img className='md:ms-10 rounded-full w-8 h-8 object-cover'
            width={30}
            src={heading == "MyDrive" ? profile || logo : heading == "Authentication" ? logo : back}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = logo;
            }}
            alt="Logo"
          />
        </button>}
      <div className="flex gap-5">
        <Link to={'/'}>
          <p className='text-slate-800 dark:text-white font-medium'>{heading}</p>
        </Link>

      </div>
      <button className='font-medium md:me-10 pe-1 text-slate-800 dark:text-white cursor-pointer' onClick={toggle}>{togglemode ? <img src={light} width={25} alt="Light" /> : <img src={dark} width={25} alt="Dark" />}</button>
    </nav>
  )
}

export default Navbar