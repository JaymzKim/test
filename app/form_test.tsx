"use client";

import { useCallback } from "react";

export default function FormTest() {
    const apiResponse = useCallback(async () => {
        const formData = new FormData();
        formData.append("name", "test");
        formData.append("wwss", "dddd");
        try {
          const response = await fetch('/api/upload/member', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
          } else {
            console.error('데이터 업로드 실패');
          }
        } catch (error) {
          console.error('네트워크 오류:', error);
        }
    }, []);
    return <>
        <button onClick={apiResponse}>api호출</button>
    </>
}