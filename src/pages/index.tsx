import { getTrackInfo } from "@/lib/spotify.client"
import { signIn, useSession } from "next-auth/react"
import { Suspense, useState } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  const handleGetAllTrackClick = async () => {
    if (!session?.accessToken) return

    const res = await fetch("/api/cached-likes")
    const data = await res.text()

    const trackInfo = await getTrackInfo({
      accessToken: session?.accessToken,
      id: data,
    })

    setSelectedTrack(trackInfo)
  }

  return (
    <main className="m-32">
      <div className="flex gap-4">
        <button className="bg-slate-200 px-4 py-2 border-gray-200 rounded-sm" onClick={() => signIn()}>
          Sign In
        </button>
        <button className="bg-slate-200 px-4 py-2 border-gray-200 rounded-sm" onClick={handleGetAllTrackClick}>
          Get all tracks
        </button>
      </div>
      <Suspense>
        <h2 className="text-2xl font-bold">Session</h2>
        <pre>{JSON.stringify({ session, status }, null, 2)}</pre>
      </Suspense>
      <Suspense>
        <h2 className="text-2xl font-bold">Random Track Choosed</h2>
        <pre>{JSON.stringify(selectedTrack, null, 2)}</pre>
      </Suspense>
    </main>
  )
}
