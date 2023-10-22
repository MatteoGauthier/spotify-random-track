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

    const formattedTracks = allTracks.map((track) => track.track.id).join(",")

    return formattedTracks
  } catch (error) {
    console.log("Error:", error)
  }
}
