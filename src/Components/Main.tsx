import { useState, useEffect } from "react";
import fileIcon from '../assets/fileIcon.png';
import folderIcon from '../assets/folderIcon.png';
import folder from '../assets/folder.png';
import file from '../assets/file.png';
import Search from "./Search";
import Navbar from "./Navbar";
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Main() {

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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in:", user.email);
            } else {
                console.log("No user signed in.");
                window.location.assign('/auth');
            }
        });
        const stored = localStorage.getItem('data');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                setdata(parsed);
            } else {
                setdata([]);
            }
        }
    }, []);

    const chooseFile = (value: string, file: any) => {
        console.log(file[0]);
        const name = value.split("\\").pop() || "";
        setfileName(name);
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

    const handleUpload = async (id: string, type: string, name: string, fileData: any) => {
        setnewFile(false);
        setdata(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const updated = [...safePrev, { id, type, name }];
            localStorage.setItem('data', JSON.stringify(updated));
            return updated;
        });
        const filePath = `${name}`;
        const storageRef = ref(storage, filePath);

        // Upload the file
        const uploadResult = await uploadBytes(storageRef, fileData);
        console.log('Uploaded a file!', uploadResult);

        setfileName("");
        setuploadbtn(false);
        setadd(false);
    };

    const itemClick = (item: DataType) => {
        console.log(item);
        setheading(item.name);
        if (item.type == "folder") {
            setplaceholder(item.name);
        }
    };

    const displayData = filteredData.length > 0 ? filteredData : data;

    return (
        <>
            <Navbar heading={heading} setheading={setheading} setplaceholder={setplaceholder} />
            <div className="pt-16 mx-auto md:max-w-xl p-3">

                <Search data={data} placeholder={placeholder} setFilteredData={setFilteredData} setadd={setadd} />

                {add && <div className="btn-group justify-center flex gap-2">
                    <button
                        className="cursor-pointer flex gap-1 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
                        onClick={() => { setnewFile(true); setnewFolder(false); }}
                    >
                        <img height={15} width={25} src={fileIcon} alt="file" />
                        Upload file
                    </button>

                    <button
                        className="cursor-pointer flex gap-1 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
                        onClick={() => { setnewFile(false); setnewFolder(true); }}
                    >
                        <img width={25} height={20} src={folderIcon} alt="folder" />
                        Create folder
                    </button>
                </div>}

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
                            }}>

                            <span className="flex bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 bg-clip-text text-transparent justify-center space-x-2">
                                <span className="font-medium flex gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} > <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /> </svg>
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
                                onClick={() => handleUpload(crypto.randomUUID(), "file", fileName, fileData)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} > <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /> </svg>
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
                            onClick={() => handleCreate(crypto.randomUUID(), "folder", foldername)}
                        >
                            Create
                        </button>
                    </div>
                )}

                {displayData.length > 0 ? (
                    <div className="w-full flex mt-10 flex-wrap gap-5 justify-center overflow-y-scroll max-h-[80vh] md:max-h-[70vh]">
                        {displayData.map((item) => (
                            <div
                                key={item.id}
                                className="w-[35%] md:w-[25%] cursor-pointer"
                                onClick={() => itemClick(item)}
                            >
                                <img
                                    className="w-[35vw] h-[35vw] md:h-[20vh]"
                                    src={item.type === "folder" ? folder : file}
                                    alt="item"
                                />
                                <p className="dark:text-white text-center">{item.name}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-center">No Items</p>
                }

            </div>
        </>
    );
}

export default Main;