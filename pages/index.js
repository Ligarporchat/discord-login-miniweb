import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>No estás logueado</p>
        <button onClick={() => signIn("discord")}>Iniciar sesión con Discord</button>
      </div>
    );
  }

  return (
    <div>
      <p>Hola, {session.user.name}!</p>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  );
}
