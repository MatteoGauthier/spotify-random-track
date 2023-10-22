import { withCache } from "@/lib/cache.server"
import { getLikedTracks } from "@/lib/spotify.server"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  console.log(session, req.method)

  const { method } = req

  if (method == "GET" && session && session.providerAccountId) {
    const { data: allLikes, cacheStatus } = await withCache(
      () => {
        return getLikedTracks({ accessToken: session.accessToken }).then((data) => data?.split(","))
      },
      {
        key: `likes_${session.providerAccountId}`,
        ttl: 60 * 60 * 12, // 12 hours
      }
    )

    if (!allLikes) {
      res.status(404)
      return
    }

    const randomTrack = allLikes[Math.floor(Math.random() * allLikes.length)]

    res.setHeader("Content-Type", "application/json")
    res.setHeader("X-Cache-Status", cacheStatus)

    res.status(200).send(randomTrack)
    return
  }

  res.status(404)
  return
}
