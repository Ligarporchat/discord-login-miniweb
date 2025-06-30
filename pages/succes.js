import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { username, id } = router.query;

  return (
    <div>
      <h1>¡Login exitoso!</h1>
      <p>Usuario: {username}</p>
      <p>ID: {id}</p>
    </div>
  );
}
