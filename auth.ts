import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { User } from '@/lib/definitions';
import executeQuery from "@/lib/mysql";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (credentials.id && credentials.password) {
            const sql = "select * from tb_pptn_sawon where swId = ? and swPwd = SHA2(CONCAT(CONCAT('*', UPPER(SHA1(UNHEX(SHA1('0009'))))), ?),256)";
            const result = await executeQuery(sql, [credentials.id, credentials.password]) as unknown[];
            const row = result[0] as any[];
            const getdata = JSON.parse(JSON.stringify(row))
            console.log(getdata)
          // 백엔드에서 로그인 처리
          // let loginRes = await backendLogin(credentials.id, credentials.password)
            let loginRes = {
                success : true,
                data : {
                user: {
                  swId: getdata.swId,
                    name: getdata.name,
                    sawonCode: getdata.sawonCode,
                    sosok: getdata.sosok
                },
                }
            }
            // 로그인 실패 처리
            if (!loginRes.success) return null;
            // 로그인 성공 처리
            const user = {
                swId: loginRes.data.user.swId ?? '',
                name: loginRes.data.user.name ?? '',
                sawonCode: loginRes.data.user.sawonCode ?? '',
                sosok: loginRes.data.user.sosok ?? '',
            } as User;
            return user;
        }
        return null;
      },
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as User
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});