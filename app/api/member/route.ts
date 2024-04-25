import { auth } from "@/auth";
import executeQuery from "@/lib/mysql";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    api: {
      bodyParser: false,
    },
  };

export async function POST(req: NextRequest) {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        console.log("formData", body.name);

    try {
        const session = await auth();
        const getUser = JSON.parse(JSON.stringify(session));

        

        
            const sql = "select * from ( select '이실장' as title, count(*) as count from tb_data_member where 상품유형 = '이실장' and sawonCode = ? and useYn = 'Y' union all select '매경' as title, count(*) as count from tb_data_member where 상품유형 <> '이실장' and sawonCode = ? and useYn = 'Y' ) as a";
            const result = await executeQuery(sql, [getUser.sawonCode, getUser.sawonCode]) as unknown[];
            //const getData = JSON.parse(JSON.stringify(result));
            console.log(result);
            return NextResponse.json(result);
        //res.status(200).json({ message: '데이터가 성공적으로 업로드되었습니다.' });
    } catch (error) {
    console.error('데이터 업로드 오류:', error);
    //res.status(500).json({ message: '데이터 업로드 중 오류가 발생했습니다.' });
    }
}