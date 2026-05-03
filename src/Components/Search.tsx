import Add from "../assets/plus.png";
import bin from "../assets/bin.png";
import { useState, useEffect, useRef, useContext } from "react";
import { MainContext } from "./Main";
import fileIcon from '../assets/fileIcon.png';
import folderIcon from '../assets/folderIcon.png';

function Search() {
  const [searchInput, setsearchInput] = useState("");
  const [Delete, setDelete] = useState(false);
  
  const { 
      placeholder,
      data,
      setFilteredData,
      setadd,
      setnewFile, 
      setnewFolder, 
      add, 
      newFile,
      setfileName,
      setuploadbtn,
      chooseFile,
      fileName,
      uploadbtn,
      handleUpload,
      newFolder,
      setfoldername,
      foldername,
      handleCreate,
      loading
    }: any = useContext(MainContext);

  const timeoutRef = useRef<any>(null);

  const search = (value: string) => {
    setsearchInput(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // console.log(value);
    
    timeoutRef.current = setTimeout(() => {
      if (!Array.isArray(data)) return;

      const results = data.filter((item:any) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      // console.log(results);
      setFilteredData(results);
    }, 300);
  };

  const handleDelete = async () => {
    const data: any = localStorage.getItem("data");
    const parsed = await JSON.parse(data);
    // console.log(parsed);
    const filteredData = await parsed.filter((item: any) => {
      return item.name !== placeholder;
    });
    localStorage.setItem("data", JSON.stringify(filteredData));
    setDelete(false);
    window.location.assign("/");
  };

  useEffect(() => {
    if (searchInput.length === 0) {
      setFilteredData([]);
    }
  }, [searchInput, setFilteredData]);


  return (
    <div className="fixed flex flex-col items-center gap-5 mx-auto w-[95%] md:max-w-xl backdrop-blur-lg rounded-2xl">
      <div
        className={`p-[2px] rounded bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 ${placeholder == "MyDrive" ? `w-[85%]` : `w-[95%]`}`}
      >
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
          {placeholder != "MyDrive" && (
            <button
              className="text-white font-bold p-3 bg-red-500 rounded-s-none rounded cursor-pointer"
              onClick={() => setDelete(true)}
            >
              <img width={25} src={bin} alt="" />
            </button>
          )}
        </div>
      </div>

      {Delete && (
        <div className="relative w-full h-50 z-10 flex justify-center">
          <div className="bg-transparent h-fit backdrop-blur-sm border-2 rounded-lg border-sky-400 p-5">
            <p className="text-white text-xl text-wrap">
              Do you Want to delete {placeholder}?
            </p>
            <p className="text-white text-lg text-wrap">
              Inorder to delete it from cloud you need to delete all its contents.
            </p>
            <div className="flex">
              <button
                onClick={() => setDelete(false)}
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
        </div>
      )}

      {add && !loading &&(
        <div className="btn-group mb-2 justify-center flex gap-2">
          <button
            className="cursor-pointer flex gap-1 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white text-lg"
            onClick={() => {
              setnewFile(true);
              setnewFolder(false);
            }}
          >
            <img height={15} width={25} src={fileIcon} alt="file" />
            Upload file
          </button>

          <button
            className="cursor-pointer flex gap-1 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white text-lg"
            onClick={() => {
              setnewFile(false);
              setnewFolder(true);
            }}
          >
            <img width={25} height={20} src={folderIcon} alt="folder" />
            Create folder
          </button>
        </div>
      )}

      {newFile && (
        <div className="p-3">
          <label
            className="flex justify-center flex-col w-full h-32 px-4 border-2 border-sky-400 border-dashed rounded-md cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();

              const file = e.dataTransfer.files[0];
              if (file) {
                setfileName(file.name);
                setuploadbtn(true);
              }
            }}
          >
            <span className="flex bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 bg-clip-text text-transparent justify-center space-x-2">
              <span className="font-medium flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />{" "}
                </svg>
                Drop files or browse
              </span>
            </span>

            <input
              type="file"
              className="hidden"
              onChange={(e) => chooseFile(e.target.value, e.target.files)}
            />

            {fileName && (
              <p className="mt-2 text-center text-sky-400">{fileName}</p>
            )}
          </label>

          {uploadbtn && (
            <button
              className="mx-auto mt-3 cursor-pointer flex gap-1 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
              onClick={() => handleUpload()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />{" "}
              </svg>
              Upload
            </button>
          )}
        </div>
      )}

      {newFolder && (
        <div className="flex gap-2 justify-center mt-10">
          <input
            value={foldername}
            onChange={(e) => setfoldername(e.target.value)}
            type="text"
            placeholder="Enter folder name"
            className="p-2 border border-sky-400 rounded outline-0 dark:text-white"
          />
          <button
            className="cursor-pointer bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
            onClick={() =>
              handleCreate(crypto.randomUUID(), "folder", foldername)
            }
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;
