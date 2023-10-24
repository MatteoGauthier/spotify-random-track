/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import { getTrackInfo } from "@/lib/spotify.client"
import { getRandomTrackFromLikes } from "@/lib/spotify.server"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const { randomTrack, cacheStatus } = await getRandomTrackFromLikes({
    accessToken: session.accessToken,
    userId: session.providerAccountId,
  })

  const trackInfo = await getTrackInfo({
    accessToken: session.accessToken,
    id: randomTrack,
  })

  return {
    props: {
      trackInfo,
    },
  }
}

export default function GetRandomTrackPage({ trackInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const coverUrl = trackInfo.album.images[0].url
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-black inset-0 absolute z-10 bg-opacity-60 h-screen w-screen flex flex-col items-center justify-center">
          <div className="flex flex-col max-w-4xl items-center justify-center text-white p-6">
            <img
              alt="Track Cover"
              className="rounded-lg object-cover aspect-square shadow-xl shadow-neutral-800"
              height="300"
              src={coverUrl}
              width="300"
            />
            <h1 className="text-2xl font-bold mt-4">{trackInfo.name}</h1>
            <h2 className="text-lg mt-2">{trackInfo.artists.map((e) => e.name).join(", ")}</h2>
            <p className="text-sm mt-2">
              {trackInfo.album.name} • {trackInfo.album.release_date}
            </p>
            <Button
              className="mt-6 py-6 px-6 select-none text-lg font-semibold rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
              variant="default"
              size="lg"
              asChild
            >
              <a target="_blank" href={trackInfo.external_urls.spotify}>
                Play on Spotify
              </a>
            </Button>
          </div>
        </div>
        <img
          src={coverUrl}
          className="absolute inset-0 w-full h-full object-cover scale-110 z-0 filter blur-md"
          alt=""
        />
      </div>
      <style global jsx>{`
        body {
          background: black;
        }
      `}</style>
    </>
  )
}
