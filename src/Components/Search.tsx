import Add from '../assets/plus.png';
import bin from "../assets/bin.png";
import { useState, useEffect, useRef } from 'react';
import loader from "../assets/loading.png";

interface DataType {
  id: string;
  type: string;
  name: string;
}

interface Props {
  data: DataType[];
  setFilteredData: (data: DataType[]) => void;
  setadd: any;
  placeholder: string;
}

function Search({ placeholder, data, setFilteredData, setadd }: Props) {

  const [searchInput, setsearchInput] = useState('');
  const [Delete, setDelete] = useState(false);

  const timeoutRef = useRef<any>(null);

  const search = (value: string) => {
    setsearchInput(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!Array.isArray(data)) return;

      const results = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredData(results);
    }, 300);
  };

  const handleDelete = async () => {
    const data:any = localStorage.getItem('data');
    const parsed = await JSON.parse(data);
    // console.log(parsed);
    const filteredData = await parsed.filter((item:any)=>{
      return item.name!==placeholder;
    })
    localStorage.setItem('data',JSON.stringify(filteredData));
    setDelete(false);
    window.location.assign("/");
  }

  useEffect(() => {
    if (searchInput.length === 0) {
      setFilteredData([]);
    }
  }, [searchInput, setFilteredData]);


  return (
    <div className="p-2 mx-auto md:max-w-xl">

      <div className={`p-[2px] rounded bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 ${placeholder == "MyDrive" ? `w-[85%]` : `w-[95%]`} mx-auto`}>
        <div className="ps-2 flex w-full bg-white dark:bg-black rounded">

          <input
            className="text-slate-800 dark:text-white w-full outline-0 text-lg bg-transparent"
            type="text"
            placeholder={`Search ${placeholder}`}
            value={searchInput}
            onChange={(e) => search(e.target.value)}
          />

          <button
            className={`text-white font-bold p-3 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 rounded-s-none ${placeholder == "MyDrive" ? `rounded` : ``} cursor-pointer`}
            onClick={() => setadd(true)}
          >
            <img src={Add} width={25} alt="Add" />
          </button>
          {placeholder != "MyDrive" && <button
            className="text-white font-bold p-3 bg-red-500 rounded-s-none rounded cursor-pointer"
            onClick={() => setDelete(true)}
          >
            <img width={25} src={bin} alt="" />
          </button>}

        </div>
      </div>

      {Delete &&<div className="relative w-full h-50 z-10 flex justify-center">
          <div className="bg-transparent h-fit backdrop-blur-sm border-2 rounded-lg border-sky-400 p-5">
            <p className="text-white text-xl text-wrap">Do you Want to delete {placeholder}?</p>
            <p className='text-white text-lg text-wrap'>Inorder to delete it from cloud you need to delete all its contents.</p>
            <div className="flex">
              <button
                onClick={()=>setDelete(false)}
                className="cursor-pointer mt-5 w-[30%] flex justify-center bg-green-500 p-2 rounded text-white font-medium text-lg mx-auto"
              >
                OK
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer mt-5 w-[60%] flex justify-center bg-red-500 p-2 rounded text-white font-medium text-lg mx-auto"
              >
                Delete anyway
              </button>
            </div>
          </div>
        </div>}

    </div>
  );
}

export default Search;