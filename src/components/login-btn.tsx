import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginButton() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground">
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div className="p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground">
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}