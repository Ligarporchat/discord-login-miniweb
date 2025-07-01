import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // 1. Guardar usuario y asignar rol
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

      // 2. Comprobar si está en servidor y asignar/invitar
      handleCheckDiscord(session.user.id);
    }
  }, [session]);

  const handleCheckDiscord = async (discord_id) => {
    try {
      const response = await fetch('/api/check-and-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discord_id }),
      });

      const data = await response.json();

      if (data.status === 'joined') {
        alert('✅ Ya estabas en el servidor. Se te ha asignado el rol.');
      } else if (data.status === 'not_in_server') {
        alert('🔗 Aún no estás en el servidor. Vamos a invitarte...');
        window.location.href = data.invite_url;
      } else {
        alert('⚠️ Algo salió mal: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('❌ Error al conectar con el servidor: ' + err.message);
    }
  };

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
