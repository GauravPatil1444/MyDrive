import Add from '../assets/plus.png';
import { useState, useEffect, useRef } from 'react';

interface DataType {
  id: string;
  type: string;
  name: string;
}

interface Props {
  data: DataType[];
  setFilteredData: (data: DataType[]) => void;
  setadd: any
}

function Search({ data, setFilteredData, setadd }: Props) {

  const [searchInput, setsearchInput] = useState('');
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


  useEffect(() => {
    if (searchInput.length === 0) {
      setFilteredData([]);
    }
  }, [searchInput, setFilteredData]);

  return (
    <div className="p-2 mx-auto md:max-w-xl">

      <div className="p-[2px] rounded bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 w-[85%] mx-auto">
        <div className="ps-2 flex w-full bg-white dark:bg-black rounded">

          <input
            className="text-slate-800 dark:text-white w-full outline-0 text-lg bg-transparent"
            type="text"
            placeholder="Search MyDrive"
            value={searchInput}
            onChange={(e) => search(e.target.value)}
          />

          <button
            className="text-white font-bold p-3 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 rounded-s-none rounded cursor-pointer"
            onClick={() => setadd(true)}
          >
            <img src={Add} width={20} alt="Add" />
          </button>

        </div>
      </div>

    </div>
  );
}

export default Search;