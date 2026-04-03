import { useEffect } from "react";
import Main from "./Components/Main";
import './index.css'

function App() {
  
  useEffect(() => {
    const theme:any = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme',theme);
  }, [])
  

    return (
    <>
      <Main/>
    </>
  )
}

export default App