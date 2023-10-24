import { withCache } from "@/lib/cache.server"

export async function getLikedTracks({ accessToken }: { accessToken: string }) {
  let allTracks: any[] = []
  let nextPage: any = `https://api.spotify.com/v1/me/tracks?limit=50`

  try {
    console.log("[getLikedTracks] : Start fetching tracks")
    while (nextPage) {
      const response = await fetch(nextPage, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      const { items, next } = data
      allTracks = [...allTracks, ...items]
      nextPage = undefined
    }

    console.log(allTracks)

    const formattedTracks = allTracks.map((track) => track.track.id).join(",")

    return formattedTracks
  } catch (error) {
    console.log("Error:", error)
  }
}

export async function getLikedTracksCached({ accessToken, id }: { accessToken: string; id: string }) {
  const { data: allLikes, cacheStatus } = await withCache(
    () => {
      return getLikedTracks({ accessToken }).then((data) => data?.split(","))
    },
    {
      key: `likes_${id}`,
      ttl: 60 * 60 * 12, // 12 hours
    }
  )

  return { allLikes, cacheStatus }
}

export async function getRandomTrackFromLikes({ accessToken, userId }: { accessToken: string; userId: string }) {
  const { allLikes, cacheStatus } = await getLikedTracksCached({
    accessToken: accessToken,
    id: userId,
  })

  if (!allLikes) {
    throw new Error("No likes found")
  }

  const randomTrack = allLikes[Math.floor(Math.random() * allLikes.length)]

  return { randomTrack, cacheStatus }
}
