import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Aquí llamamos a la API para guardar usuario y asignar rol
      fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          discord_id: session.user.id,
          username: session.user.name,
        }),
      })
      .then(res => res.json())
      .then(data => console.log('Usuario guardado y rol asignado:', data))
      .catch(err => console.error('Error:', err));
    }
  }, [session]);

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
