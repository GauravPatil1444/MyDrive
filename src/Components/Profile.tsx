import Navbar from "./Navbar"
import profileDark from "../assets/profile-dark.png"
import profileLight from '../assets/profile-light.png'
import { auth } from "../../firebaseConfig"
import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth" 
import loader from "../assets/loading.png"

function Profile() {

    const storage = getStorage();

    const [name, setname] = useState<string | null | undefined>();
    const [email, setemail] = useState<string | null | undefined>();
    const [edit, setedit] = useState(false);
    const [uploadbtn, setuploadbtn] = useState(false);
    const [fileName, setfileName] = useState<string>("");
    const [fileData, setfileData] = useState<any>();
    const [profileimg, setprofileimg] = useState<any>("");
    const [loading, setloading] = useState(false);

    const chooseFile = (value: string, file: any) => {
        const name = value.split("\\").pop() || "";
        setfileName(name);
        setfileData(file[0]);
        setuploadbtn(true);
    }

    const handleUpload = async(fileData: any) => {
        setloading(true);
        const storageRef = ref(storage, `${auth.currentUser?.uid}/profile/${fileName}`);
        await uploadBytes(storageRef, fileData).then((snapshot) => {
            console.log('Profile Updated!',snapshot);
        })
        await getDownloadURL(storageRef).then(async(url)=>{
            console.log(url);
            const user:any = auth.currentUser;
            setprofileimg(url)
            await updateProfile(user, {
                photoURL: url,
            });
        })
        setedit(false);
        setloading(false);
    }

    const handleLogout = async() =>{
        await signOut(auth);
        window.location.assign("/auth");
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setname( user.displayName)
                setemail(user.email)
                if(user.photoURL!=null){
                    setprofileimg(user.photoURL)
                }
                else{
                    setprofileimg("")
                }
            } else {
                console.log("No user signed in.");
                window.location.assign('/auth');
            }
        });
    }, [])


    return (
        <>
            <Navbar heading="Profile" />
            <div className="pt-20">
                <div className="mx-auto w-32 h-32 rounded-full p-1 bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 ">
                    {profileimg.length==0?<>
                        <img className="hidden dark:block" src={profileDark} alt="Profile" />
                        <img className="dark:hidden" src={profileLight} alt="Profile" />
                        </>:
                        <img className="w-full h-full rounded-full object-cover" src={profileimg} alt="Profile" />
                    }
                </div>
                <div className="text-center mt-2 flex flex-col gap-2">
                    <p className="text-center text-xl text-white">{name}</p>
                    <p className="text-center text-xl text-white">{email}</p>
                </div>
                <div className="mt-3 flex gap-5">
                    <button
                        className="me-0 mx-auto cursor-pointer bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
                        onClick={() => setedit(true)}
                    >
                        Edit profile
                    </button>
                    <button
                        className="ms-0 mx-auto cursor-pointer bg-linear-to-r from-blue-400 via-blue-400 to-purple-400 p-2 rounded text-white font-medium"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
                {edit && (
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
                                onClick={() => handleUpload(fileData)}
                                disabled={loading}
                            >
                                {loading?<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} > <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /> </svg>:
                                <img className="animate-spin" width={25} src={loader} alt="Loading..." />}
                                Upload
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default Profile