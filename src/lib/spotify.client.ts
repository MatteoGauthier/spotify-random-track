import { Track } from "@/types/spotify"

export async function getTrackInfo({ id, accessToken }: { id: string; accessToken: string }) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  return data as Track
}
