import { auth, signOut } from "@/auth";
import Link from "next/link";
import FormTest from "./form_test";

export default async function Home() {
  const session = await auth();
  const getdata = JSON.parse(JSON.stringify(session));
  console.log(getdata);

  
  return (
    <div>
      <h1>홈 페이지</h1>
      <ul>
        <li><Link href="/">홈</Link></li>
        <li><Link href="/upload">업로드</Link></li>
      </ul>
      <h2>인증 없이 못보는 화면{getdata.user.sosok}/{getdata.user.sawonCode}</h2>
      <form action={async () => {
          	'use server';
            await signOut();
          }}>
          <button>
            로그아웃
          </button>
        </form>
          <FormTest />
    </div>
  )
}