import { useEffect, useState } from "react";
import file from "../assets/file.png";
import Navbar from "./Navbar";
import { getStorage, getMetadata, ref, deleteObject } from "firebase/storage";
import loader from "../assets/loading.png";
import loaderLight from "../assets/loading_light.png";
import download from "../assets/download.png";
import bin from "../assets/bin.png"


function FileInfo({ fileInfo }: any) {

  interface fileData {
    name: string;
    size: number;
    contentType: string | undefined;
    timeCreated: string;
  }

  const storage = getStorage();

  const [fileData, setfileData] = useState<fileData>();
  const [loading, setloading] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [Deleting, setDeleting] = useState(false);

  const handleDownload = async () => {
    setloading(true);
    const urlObj = new URL(fileInfo.id);
    const path = urlObj.pathname;
    const pathSegment = path.split('/o/')[1];
    const decodedPath = decodeURIComponent(pathSegment);

    const a = document.createElement('a');
    a.href = decodedPath;
    a.download = fileInfo.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setloading(false);
  }

  const handleDelete = async()=>{
    setDeleting(true);
    setDelete(false);
    
    const data:any = localStorage.getItem('data');
    const parsed = await JSON.parse(data);
    console.log(parsed);
    const filteredData = await parsed.filter((item:any)=>{
      return item.id!==fileInfo.id;
    })
    localStorage.setItem('data',JSON.stringify(filteredData));

    const urlObj = new URL(fileInfo.id);
    const path = urlObj.pathname;
    const pathSegment = path.split('/o/')[1];
    const decodedPath = decodeURIComponent(pathSegment);
    const fileRef = ref(storage, decodedPath);

    await deleteObject(fileRef).then(() => {
      console.log(`${fileInfo.name} deleted successfully!`);
    })

    setDeleting(false);
    window.location.assign("/");
  }

  useEffect(() => {
    setloading(true);
    const urlObj = new URL(fileInfo.id);
    const path = urlObj.pathname;
    const pathSegment = path.split('/o/')[1];
    const decodedPath = decodeURIComponent(pathSegment);

    const fileRef = ref(storage, decodedPath);
    getMetadata(fileRef)
      .then((metadata) => {
        setfileData({ name: metadata.name, size: metadata.size, contentType: metadata.contentType, timeCreated: metadata.timeCreated });
      })
    setloading(false);
  }, [fileInfo])

  return (
    <>
      <Navbar heading={fileInfo.name} />
      <div className="pt-20  mx-auto md:max-w-xl p-3">
        {Delete &&<div className="relative w-full h-50 z-10 flex justify-center">
          <div className="bg-transparent h-fit backdrop-blur-sm border-2 rounded-lg border-sky-400 p-5">
            <p className="text-white text-xl">Want to delete this {fileInfo.type}?</p>
            <div className="flex justify-between">
              <button
                onClick={()=>setDelete(false)}
                className="cursor-pointer mt-5 w-[40%] flex justify-center bg-green-500 p-2 rounded text-white font-medium text-lg mx-auto"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer mt-5 w-[40%] flex justify-center bg-red-500 p-2 rounded text-white font-medium text-lg mx-auto"
              >
                Yes
              </button>
            </div>
          </div>
        </div>}
        <div
          className="md:max-w-xl cursor-pointer"
        >
          <img
            className={`mx-auto ${loading ? 'animate-pulse' : ''}`}
            width={155}
            src={file}
            alt="item"
          />
          {fileData != undefined ? <>
            <p className="dark:text-white text-center text-wrap text-lg">{fileInfo.name}</p>
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg">{(fileData.size / 1000) > 1000 ? `${((fileData.size / 1000) / 1000)} MB` : `${(fileData.size / 1000)} KB`}</p>
            <p className="text-gray-500 dark:text-gray-400 text-center text-wrap">{`${fileData.timeCreated.split('T')[0].split('-')[2]}-${fileData.timeCreated.split('T')[0].split('-')[1]}-${fileData.timeCreated.split('T')[0].split('-')[0]}`}</p>
            <p className="text-gray-500 dark:text-gray-400 text-center text-wrap">{fileData.contentType}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleDownload}
                disabled={loading}
                className="ms-0 me-0 cursor-pointer mt-5 flex justify-center bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium text-lg mx-auto"
                >
                {loading ? <img className="animate-spin" width={25} src={loader} alt="Loading..." /> : <img className="animate-bounce me-2" width={25} src={download} alt="" />}
                Download
              </button>
              <button
                  onClick={()=>setDelete(true)}
                  className="ms-0 me-0  cursor-pointer mt-5 flex justify-center bg-red-500 p-2 rounded text-white font-medium text-lg mx-auto"
                  >
                  <img width={25} className={`${Deleting?'animate-spin':''}`} src={Deleting?loader:bin} alt="" />
                </button>
              </div>
          </> :
            <>
              <img className={`animate-spin mx-auto hidden dark:block`} width={45} src={loader} alt="Loading..." />
              <img className={`animate-spin mx-auto dark:hidden`} width={45} src={loaderLight} alt="Loading..." />
            </>
          }
        </div>
      </div>
    </>
  )
}

export default FileInfo