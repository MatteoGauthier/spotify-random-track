import NextAuth, { AuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

const scopes = "user-read-email user-library-read"

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.providerAccountId = account.providerAccountId
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-expect-error
      session.accessToken = token.accessToken
      // @ts-expect-error
      session.providerAccountId = token.providerAccountId
      return session
    },
  },
}

export default NextAuth(authOptions)
