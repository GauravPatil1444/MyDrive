import { useState, useEffect, createContext } from "react";
import folder from '../assets/folder.png';
import file from '../assets/file.png';
import pokeball from '../assets/pokeball.png';
import pkmn1 from '../assets/pkmn1.png';
import pkmn2 from '../assets/pkmn2.png';
import pkmn3 from '../assets/pkmn3.png';
import pkmn4 from '../assets/pkmn4.png';
import pkmn5 from '../assets/pkmn5.png';
import pkmn6 from '../assets/pkmn6.png';
import Search from "./Search";
import Navbar from "./Navbar";
import { getStorage, ref, uploadBytesResumable, listAll, getDownloadURL } from 'firebase/storage';
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import FileInfo from "./FileInfo";
import loader from "../assets/loading.png";
import loaderLight from "../assets/loading_light.png";
import zip from "../assets/zip.png";
import imgFile from "../assets/image-file.png";
import pdf from "../assets/pdf.png";

export interface MainContextType {
  heading: string;
  setheading: React.Dispatch<React.SetStateAction<string>>;
  placeholder:string;
  setplaceholder: React.Dispatch<React.SetStateAction<string>>;
  itemClick: (item: any) => void;
  fileStack: string;
  setfileStack: React.Dispatch<React.SetStateAction<string>>;
  viewFile: boolean;
  setviewFile: any;
  setFilteredData: any;
  fileInfo: any;
  setadd: any;
  add: any;
  foldername: any;
  setfoldername: any;
  newFile: any;
  uploadbtn: any;
  newFolder: any;
  chooseFile: any;
  handleCreate: any;
  handleUpload: any;
  data: any;
  setnewFolder: any;
  setnewFile: any;
  fileName: any;
  setfileName: any;
  loading: any;
}

export const MainContext = createContext<MainContextType|null>(null);

export const useFileLogo = (name: string, id: string) => {
        
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

function Main() {

    const storage = getStorage();

    interface DataType {
        id: string,
        type: string,
        name: string
    }

    const [data, setdata] = useState<DataType[]>([]);
    const [filteredData, setFilteredData] = useState<DataType[]>([]);
    const [fileName, setfileName] = useState<string>("");
    const [newFile, setnewFile] = useState(false);
    const [newFolder, setnewFolder] = useState(false);
    const [uploadbtn, setuploadbtn] = useState(false);
    const [foldername, setfoldername] = useState("");
    const [add, setadd] = useState(false);
    const [heading, setheading] = useState("MyDrive");
    const [placeholder, setplaceholder] = useState("MyDrive");
    const [fileData, setfileData] = useState<any>();
    const [loading, setloading] = useState(false);
    const [fileInfo, setfileInfo] = useState<DataType>();
    const [viewFile, setviewFile] = useState(false);
    const [fileStack, setfileStack] = useState("");
    const [uploadProgress, setuploadProgress] = useState<number>();


    const syncData = async () => {
        setloading(true);
        const id: any = localStorage.getItem('user');
        if (id === null) {
            window.location.assign("/auth")
        }
        const storageRef = ref(storage, `${JSON.parse(id)}/files/`);
        // console.log("-->", storageRef);

        const res = await listAll(storageRef);
        res.items.forEach(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            // console.log("File:", itemRef.name, url);
            setdata(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const updated = [...safePrev, { id: url, type: "file", name: itemRef.name }];
                localStorage.setItem('data', JSON.stringify(updated));
                return updated;
            });
        });

        res.prefixes.forEach((folderRef) => {
            const folderPath = folderRef.fullPath.split('/');
            const folder = folderPath[folderPath.length - 1];
            setdata(prev => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const updated = [...safePrev, { id: folderRef.fullPath, type: "folder", name: folder }];
                localStorage.setItem('data', JSON.stringify(updated));
                return updated;
            });
        });
        setloading(false);
    }

    const chooseFile = (value: string, file: any) => {
        // console.log(file[0]);
        const name = value.split("\\").pop() || "";
        setfileName(name);
        setfileData(file[0]);
        setuploadbtn(true);
    };

    const handleCreate = (id: string, type: string, name: string) => {
        setnewFolder(false);

        setdata(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const updated = [...safePrev, { id, type, name }];
            localStorage.setItem('data', JSON.stringify(updated));
            return updated;
        });
        setadd(false);
        setfoldername("");
    };


    const handleUpload = async () => {
        // console.log(200);
        setloading(true);
        setnewFile(false);
        const url = heading == "MyDrive" ? `${auth.currentUser?.uid}/files/${fileName}` : `${auth.currentUser?.uid}/files${fileStack}/${fileName}`;
        const storageRef = ref(storage, url);

        const uploadTask = uploadBytesResumable(storageRef, fileData);

        uploadTask.on('state_changed',
            (snapshot) => {

                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + Math.round(progress) + '% done');
                setuploadProgress(Math.round(progress));
            },
            () => {
                // console.error("Upload failed:", error);
                setloading(false);
            },
            async () => {
                // console.log('Upload complete!');
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                if (heading == "MyDrive") {
                    setdata(prev => {
                        const safePrev = Array.isArray(prev) ? prev : [];
                        const updated = [...safePrev, { id: downloadURL, type: "file", name: fileName }];
                        localStorage.setItem('data', JSON.stringify(updated));
                        return updated;
                    });
                }
                else {
                    setdata(prev => {
                        const safePrev = Array.isArray(prev) ? prev : [];
                        const updated = [...safePrev, { id: downloadURL, type: "file", name: fileName }];
                        return updated;
                    });
                }
                setadd(false);
                setfileName("");
                setuploadbtn(false);
                setloading(false);
            }
        );
    };


    const listItems = async (res: any) => {
        try {
            const filePromises = res.items.map(async (itemRef: any) => {
                const url = await getDownloadURL(itemRef);
                return {
                    id: url,
                    type: "file",
                    name: itemRef.name
                };
            });

            const files = await Promise.all(filePromises);
            const folders = res.prefixes.map((folderRef: any) => {
                const folderPath = folderRef.fullPath.split('/');
                const folder = folderPath[folderPath.length - 1];

                return {
                    id: folderRef.fullPath,
                    type: "folder",
                    name: folder
                };
            });
            setdata([...folders, ...files]);

        } catch {
            // console.error("Error listing items");
        }
    };

    const itemClick = async (item: DataType) => {

        if (item.id == "1444") {
            setheading(item.name.split('/')[item.name.split('/').length - 1]);
            setdata([]);
            setloading(true);
            setplaceholder(item.name.split('/')[item.name.split('/').length - 1]);
            const storageRef = ref(storage, `${auth.currentUser?.uid}/files${item.name}`);
            const res = await listAll(storageRef);
            await listItems(res);
            setloading(false);
            return;
        }
        if (!loading) {
            // // console.log(item);
            setheading(item.name);
            if (item.type == "folder") {
                setdata([]);
                setloading(true);
                setplaceholder(item.name);
                const storageRef = ref(storage, `${heading == "MyDrive" ? `${auth.currentUser?.uid}/files/${item.name}` : `${auth.currentUser?.uid}/files${fileStack}/${item.name}`}`);
                // console.log(fileStack);
                const res = await listAll(storageRef);
                await listItems(res);
                setloading(false);
            }
            else {
                setfileInfo(item);
                setviewFile(true);
            }
        }
    };

    useEffect(() => {
        if (heading == "MyDrive") {
            setloading(true);
            setdata([]);
            setfileStack("");
            const stored = localStorage.getItem('data');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setTimeout(() => {
                        if (data !== parsed) {
                            setdata(parsed);
                        }
                    }, 1500);
                } else {
                    setdata([]);
                }
            }
            setloading(false);
        }
        else if (heading == "") {
            setheading("MyDrive");
            setplaceholder("MyDrive");
            setfileStack("");
        }
        else {
            setfileStack(`${fileStack}/${heading}`)
            // console.log(fileStack);
        }
    }, [heading])

    useEffect(() => {
        setdata([]);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log("User is signed in:", user.email);
            } else {
                // console.log("No user signed in.");
                window.location.assign('/auth');
            }
        });

        syncData();
    }, []);


    let displayData = filteredData.length > 0 ? filteredData : data;

    return (
        <MainContext.Provider value={{ heading, setheading, placeholder, setplaceholder, itemClick, fileStack, setfileStack, viewFile, setviewFile, setFilteredData, fileInfo, setadd, newFile, foldername, setfoldername, add, handleUpload, chooseFile, handleCreate, newFolder, uploadbtn, data, setnewFolder, setnewFile, fileName, setfileName, loading}}>
            <Navbar />
            {viewFile ? <FileInfo/> :
                <>
                    <div className="pt-16 mx-auto md:max-w-xl p-3">

                        <Search />

                        {loading && <>
                            <img className={`animate-spin mt-15 mx-auto hidden dark:block`} width={45} src={loader} alt="Loading..." />
                            <img className={`animate-spin mt-15 mx-auto dark:hidden`} width={45} src={loaderLight} alt="Loading..." />
                            <p className="flex bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 bg-clip-text text-transparent justify-center space-x-2 mt-5">{uploadProgress!=undefined&&`Uploading...${uploadProgress} %`}</p>
                        </>}

                        {displayData.length > 0 ? (
                            <div className={`w-full flex mt-15 flex-wrap gap-5 justify-center overflow-y-scroll max-h-[${window.screen.height}] md:max-h-[70vh]`}>
                                {displayData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="w-[35%] md:w-[25%] cursor-pointer"
                                        onClick={() => itemClick(item)}
                                    >
                                        <img
                                            className={`w-[35vw] h-[35vw] md:h-[20vh] object-cover md:object-contain  rounded-lg ${loading ? "animate-pulse" : ""}`}
                                            src={item.type === "folder" ? folder : useFileLogo(item.name, item.id)}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = imgFile;
                                            }}
                                            alt="item"
                                        />
                                        <p className="dark:text-white text-center overflow-hidden text-wrap">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) :
                            !loading && <p className="dark:text-white font-medium text-center text-lg">{placeholder} is empty</p>
                        }

                    </div>
                </>}

        </MainContext.Provider>
    );
}

export default Main;