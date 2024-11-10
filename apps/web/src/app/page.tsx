import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Infer API</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Get started with our ML inference API
      </p>
      
      {userId ? (
        <Link
          href="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Go to Dashboard
        </Link>
      ) : (
        <Link
          href="/sign-up"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </Link>
      )}
    </div>
  )
}
