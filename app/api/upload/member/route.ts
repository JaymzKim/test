import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import * as XLSX from "xlsx";
import executeQuery from "@/lib/mysql";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {

  const formData = await req.formData();
        const body = Object.fromEntries(formData);

  if (req.method === "POST") {
    try {
      const session = await auth();
      const sawonData = JSON.parse(JSON.stringify(session));


      const file = body.file;
      //const dddd = await req.json();
      //const arrayBuffer = await new Response(file).arrayBuffer();
      const data = new Uint8Array(await new Response(file).arrayBuffer());
      //console.log(data, session, sawonData.user.sawonCode);
      const workbook = XLSX.read(data, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const insertData = [];
        for (let i = 0; i < jsonData.length; i++) {
            insertData.push([
                jsonData[i]["상품유형"],
                jsonData[i]["상품명"],
                jsonData[i]['회원번호'],
                jsonData[i]['상호명'],
                jsonData[i]['사업자번호'],
                jsonData[i]['대표자명'],
                jsonData[i]['휴대폰 번호'],
                jsonData[i]['시도'],
                jsonData[i]['구시군'],
                jsonData[i]['읍면동'],
                jsonData[i]['상세주소'],
                jsonData[i]['계약구분'],
                jsonData[i]['결제일'],
                jsonData[i]['시작일'],
                jsonData[i]['종료일'],
                jsonData[i]['담당자'],
                jsonData[i]['상태'],
                jsonData[i]['계약전송수'],
                jsonData[i]['전송수'],
                jsonData[i]['계약단지']
            ]);
        }
      //console.log(jsonData);
        const placeholders = Array.from({ length: 20 }, () => '?').join(',');
        const valuePlaceholders = insertData.map(row => `(1, 1, ${row.map(() => '?').join(',')}, now(), now(), 'Y', ${sawonData.user.sawonCode})`).join(',');
        const query = `INSERT INTO tb_data_member_test (upchaSeq, uploadSeq, 상품유형, 상품명, 회원번호, 상호명, 사업자번호, 대표자명, 휴대폰, 시도, 시군구, 읍면동, 상세주소, 계약구분, 결제일, 시작일, 종료일, 담당자, 상태, 계약전송수, 전송수, 계약단지명, regDate, modDate, useYn, sawonCode) VALUES ${valuePlaceholders}`;

        //const query = `INSERT INTO tb_data_member_test (upchaSeq, uploadSeq, 상품유형, 상품명, 회원번호, 상호명, 사업자번호, 대표자명, 휴대폰, 시도, 시군구, 읍면동, 상세주소, 계약구분, 결제일, 시작일, 종료일, 담당자, 상태, 계약전송수, 전송수, 계약단지명, regDate, modDate, useYn, sawonCode) VALUES ` + insertData.map(() => ` (1, 1, ${placeholders}, now(), now(), 'Y', ?)`).join(', ');

        await executeQuery(query, insertData.flat());
        //console.log(jsonData[i][0], sawonData.user.sawonCode);

      return new Response(JSON.stringify({message: '데이터가 성공적으로 업로드되었습니다.'}));
    } catch (error) {
      console.error('데이터 업로드 오류:', error);
      return new Response(JSON.stringify({ message: '데이터 업로드 중 오류가 발생했습니다.' }));
    }
  } else {
    console.log(req.method);
  }
}