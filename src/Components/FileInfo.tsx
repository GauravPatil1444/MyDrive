import { useEffect, useState, useContext } from "react";
import file from "../assets/file.png";
import Navbar from "./Navbar";
import { getStorage, getMetadata, ref, deleteObject, getDownloadURL } from "firebase/storage";
import loader from "../assets/loading.png";
import loaderLight from "../assets/loading_light.png";
import download from "../assets/download.png";
import bin from "../assets/bin.png"
import zip from "../assets/zip.png";
import imgFile from "../assets/image-file.png";
import pdf from "../assets/pdf.png";
import pokeball from '../assets/pokeball.png';
import pkmn1 from '../assets/pkmn1.png';
import pkmn2 from '../assets/pkmn2.png';
import pkmn3 from '../assets/pkmn3.png';
import pkmn4 from '../assets/pkmn4.png';
import pkmn5 from '../assets/pkmn5.png';
import pkmn6 from '../assets/pkmn6.png';
import { MainContext } from './Main';

function FileInfo() {

  interface fileData {
    name: string;
    size: number;
    contentType: string | undefined;
    timeCreated: string;
  }

  const storage = getStorage();

  const { fileInfo }: any = useContext(MainContext);

  const [fileData, setfileData] = useState<fileData>();
  const [loading, setloading] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [Deleting, setDeleting] = useState(false);

  const handleDownload = async () => {
    const urlObj = new URL(fileInfo.id);
    const path = urlObj.pathname;
    const pathSegment = path.split('/o/')[1];
    const decodedPath = decodeURIComponent(pathSegment);
    try {
      const fileRef = ref(storage, decodedPath);
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const filename = decodedPath.split('/').pop() || 'downloaded-file';
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl);

    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP error! status: 404')) {
        alert('The requested file does not exist.');
      } else if (error instanceof Error && error.message.includes('storage/unauthorized')) {
        alert('You do not have permission to access this file. Check Firebase Storage Security Rules.');
      } else {
        alert('An unexpected error occurred during download.');
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDelete(false);

    const data: any = localStorage.getItem('data');
    const parsed = await JSON.parse(data);
    // console.log(parsed);
    const filteredData = await parsed.filter((item: any) => {
      return item.id !== fileInfo.id;
    })
    localStorage.setItem('data', JSON.stringify(filteredData));

    const urlObj = new URL(fileInfo.id);
    const path = urlObj.pathname;
    const pathSegment = path.split('/o/')[1];
    const decodedPath = decodeURIComponent(pathSegment);
    const fileRef = ref(storage, decodedPath);

    await deleteObject(fileRef).then(() => {
      // console.log(`${fileInfo.name} deleted successfully!`);
    })

    setDeleting(false);
    window.location.assign("/");
  }

  const handleFileLogo = (name: string, id: string) => {
    console.log(`../assets/pkmn${Math.floor(Math.random() * (6 - 1 + 1)) + 1}.png`);

    if (name.split('.')[1] == "zip" || name.split('.')[1] == "rar") {
      return zip;
    }
    else if (name.split('.')[1] == "jpg" || name.split('.')[1] == "png" || name.split('.')[1] == "jpeg" || name.split('.')[1] == "webp" || name.split('.')[1] == "avif" || name.split('.')[1] == "gif") {
      return id;
    }
    else if (name.split('.')[1] == "pdf") {
      return pdf
    }
    else if (name.split('.')[1] == "gbc" || name.split('.')[1] == "gba" || name.split('.')[1] == "nds") {
      return pokeball
    }
    else if (name.split('.')[1] == "sav") {
      const pkmnImages = [pkmn1, pkmn2, pkmn3, pkmn4, pkmn5, pkmn6];
      return pkmnImages[Math.floor(Math.random() * pkmnImages.length)];
    }
    else {
      return file;
    }
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
      <Navbar />
      <div className="pt-20  mx-auto md:max-w-xl p-3">
        {Delete && <div className="relative w-full h-50 z-10 flex justify-center">
          <div className="bg-transparent h-fit backdrop-blur-sm border-2 rounded-lg border-sky-400 p-5">
            <p className="text-white text-xl">Want to delete this {fileInfo.type}?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setDelete(false)}
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
            className={`mx-auto w-[35vw] h-[35vw] md:h-[20vh] rounded-lg object-cover md:object-contain md:object-contain  ${loading ? 'animate-pulse' : ''}`}
            width={155}
            src={handleFileLogo(fileInfo.name, fileInfo.id)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = imgFile;
            }}
            alt="item"
          />
          {fileData != undefined ? <>
            <p className="dark:text-white text-center text-wrap text-lg">{fileInfo.name}</p>
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg">{(fileData.size / 1000) > 1000 ? `${(Math.round((fileData.size / 1000) / 1000))} MB` : `${Math.round((fileData.size / 1000))} KB`}</p>
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
                onClick={() => setDelete(true)}
                className="ms-0 me-0  cursor-pointer mt-5 flex justify-center bg-red-500 p-2 rounded text-white font-medium text-lg mx-auto"
              >
                <img width={25} className={`${Deleting ? 'animate-spin' : ''}`} src={Deleting ? loader : bin} alt="" />
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