import { useEffect, useState } from "react";
import file from "../assets/file.png";
import Navbar from "./Navbar";
import { getStorage, getMetadata, ref, getDownloadURL } from "firebase/storage";
import loader from "../assets/loading.png";
import loaderLight from "../assets/loading_light.png";
import download from "../assets/download.png";

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
      <div className="pt-20">
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
            <button
              onClick={handleDownload}
              disabled={loading}
              className="cursor-pointer mt-5 flex justify-center bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium text-lg mx-auto"
            >
              {loading ? <img className="animate-spin" width={25} src={loader} alt="Loading..." /> : <img className="animate-bounce me-2" width={25} src={download} alt="" />}
              Download
            </button>
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