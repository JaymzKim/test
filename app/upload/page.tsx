"use client";
import { useCallback, useState } from 'react';

const UploadClient = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch('/api/upload/member', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
        } else {
          console.error('데이터 업로드 실패');
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    } else {
      console.error('파일을 선택해주세요.');
    }
  }, [selectedFile]);


  return (
    <div>
      <h1>엑셀 파일 업로드</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
};

export default UploadClient;