import { getProviders, signIn } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const [providers, setProviders] = useState<Awaited<ReturnType<typeof getProviders>> | null>(null)

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-10 shadow-xl">
        <h1 className="text-xl font-semibold mb-6">Sign in to your account</h1>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="w-full mb-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
