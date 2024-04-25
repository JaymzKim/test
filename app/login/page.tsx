"use client";

import { authenticate } from "@/lib/actions"
import { useFormState } from "react-dom"

export default function Page() {
  	// 추후에 추가될 로그인 메소드
    const [errorMsg, dispatch] = useFormState(authenticate, undefined)
    return (
      <div>
        <h1>로그인 페이지</h1>
        <form className="flex flex-col" action={dispatch}>  
            <input className="bg-blue-300 text-black" name="id"></input>
            <input className="bg-yellow-300 text-black" name="password" type="password"></input>
            <button>
                로그인
            </button>
 			{/* 추후에 추가될 에러 메세지
            <p>{errorMsg}</p> */}
        </form>
      </div>
    )
  }