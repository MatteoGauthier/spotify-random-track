import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string
    userId: string
    providerAccountId: string
    user: {
      /** The user's postal address. */
      accessToken: string
      userId: string
      providerAccountId: string
    } & DefaultSession["user"]
  }
}
