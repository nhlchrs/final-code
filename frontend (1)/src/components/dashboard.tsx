import React, { useEffect, useState } from 'react';
import UploadModal from './Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {getImageForExtension} from "./utils/helper"
import { toast } from 'react-toastify';
import IsLoadingHOC from './utils/isLoading';
interface UploadedFile {
  _id: string;
  id?: string;
  name: string;
  type: string;
  createdAt: string;
}

const Dashboard: React.FC = ({setLoading}: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const navigate = useNavigate();


  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ files: UploadedFile[] }>(
        `${process.env.REACT_APP_BASE_URL}/api/upload/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFiles(response.data?.files || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
     const response =  await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/upload/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          fileId,
        },
      });

      const data = response?.data


      if(data?.status === 1 ){
        setLoading(false);
         toast.success(data?.message);
      }
      else{
        setLoading(false);
         toast.error(data?.message);
      }

      fetchFiles();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleClick = (id: string) => {
    navigate(`/dashboard/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
     toast.success("User logout successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Extract My File</h1>

        <div className="flex gap-4">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-500 text-sm font-medium shadow"
            onClick={() => setShowModal(true)}
          >
            Upload File
          </button>
          <button
            className="bg-gray-100 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-200 text-sm font-medium shadow"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Uploaded Files</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 p-5 flex flex-col items-center text-center"
            >
              <img
                src={getImageForExtension(file.type)}
                alt={`${file.type} file`}
                className="h-20 w-20 object-contain mb-4"
              />
              <h3 className="text-base font-medium text-gray-800 truncate w-full">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">.{file?.type?.toUpperCase()}</p>
              <p className="text-xs text-gray-400 mt-1">Created: {file.createdAt}</p>
              <div className="mt-4 flex gap-3">
                <button
                  className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  onClick={() => handleClick(file._id)}
                >
                  Preview
                </button>
                <button
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  onClick={() => handleDelete(file._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <UploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        fetchFiles={fetchFiles}
        setLoading={setLoading}
      />
    </div>
  );
};

export default IsLoadingHOC(Dashboard);
