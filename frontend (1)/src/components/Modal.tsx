import axios from 'axios';
import React, { useState, ChangeEvent } from 'react';
import { getIcon } from './utils/helper';
import { toast } from 'react-toastify';
import IsLoadingHOC from './utils/isLoading';
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchFiles: () => void;
  setLoading: (loading: boolean) => void; 
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, fetchFiles,setLoading }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const allowedTypes = ['csv', 'xls', 'xlsx'];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const filtered = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ext && allowedTypes.includes(ext);
    });
    setSelectedFiles(filtered);
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('file', file);
    });
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/upload/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = response.data
      if(data?.status ===1){
        setLoading(false);
         toast.success(data?.message);
      }
      else{
        setLoading(false);
        toast.error(data?.message);

      }

      setSelectedFiles([]);
      fetchFiles();
      onClose();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative">
        <h2 className="text-lg font-semibold mb-4">Upload Your File</h2>
        <input
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileChange}
          multiple
          className="mb-4"
        />
        <div className="space-y-2 max-h-40 overflow-auto">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <img src={getIcon(file.name)} alt="icon" className="w-8 h-8" />
              <p className="text-sm truncate">{file.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsLoadingHOC(UploadModal);
