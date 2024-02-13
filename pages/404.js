import { useRouter } from "next/router";

export default function Error() {
  const router = useRouter();
  return (
    <section className="w-Home">
      <h1>Regresar al</h1>
        <button onClick={() => router.push('/')}>Inicio</button>
    </section>
  );
}
