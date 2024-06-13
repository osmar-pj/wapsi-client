import { useRouter } from "next/router";

export default function Error() {
  const router = useRouter();
  return (
    <section className="w-Home">
      <div className="container">
        <img
          src="src/images/illustration/illustration-01.svg"
          alt="illustration"
        />
        <h1> Lo sentimos, no se puede encontrar la página</h1>
        <p>
          La página que estabas buscando parece haber sido movida, eliminada o
          no existe.
        </p>
        <button onClick={() => router.push("/")}>Regresar al Inicio</button>
      </div>
    </section>
  );
}
