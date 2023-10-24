import { withCache } from "@/lib/cache.server"
import { getLikedTracks, getLikedTracksCached, getRandomTrackFromLikes } from "@/lib/spotify.server"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  const { method } = req

  if (method == "GET" && session && session.providerAccountId) {
    try {
      const { randomTrack, cacheStatus } = await getRandomTrackFromLikes({
        accessToken: session.accessToken,
        userId: session.providerAccountId,
      })

      res.setHeader("Content-Type", "application/json")
      res.setHeader("X-Cache-Status", cacheStatus)

      res.status(200).send(randomTrack)
      return
    } catch (e) {
      console.log(e)
      res.status(500)
      return
    }
  }

  res.status(404)
  return
}
