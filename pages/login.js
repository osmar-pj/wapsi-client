import { useMainContext } from "@/src/contexts/Main-context";
import { ValidLogin } from "@/src/hooks/ValidLogin";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";


export default function Login() {
  const { login } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState(Array(8).fill(""));
  const [showError, setShowError] = useState(false);
  const inputReferences = useRef([]);
  const router = useRouter();

  const areAllCodesEntered = () => {
    return codes.every((code) => code !== "");
  };

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    const isNumeric = /^\d*$/.test(value);
    if (isNumeric) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && inputReferences.current[index + 1]) {
        inputReferences.current[index + 1].focus();
      }
    }
  };

  const handleInputKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !codes[index] &&
      inputReferences.current[index - 1]
    ) {
      inputReferences.current[index - 1].focus();
    }
  };

  const resetForm = () => {
    inputReferences.current[0].focus();
    setCodes(Array(8).fill(""));
  };

  const handleSubmit = async () => {
    inputReferences.current[codes.length - 1].blur();
    setLoading(true);

    const combinedValue = codes.join("");
    const initialData = { code: combinedValue };
    try {
      const success = await ValidLogin(initialData, login);
      if (success) {
        router.push("/");
      } else {
        console.error("El inicio de sesión falló.");
        resetForm();
        setLoading(false);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    if (areAllCodesEntered()) {
      handleSubmit();
    }
  }, [codes]);

  return (
    <section className="L-Home">
      <form
        className="Login-content"
        action=""
        onSubmit={handleSubmit}
        style={{
          userSelect: loading ? "none" : "auto",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <img src="/imgs/logo-web.svg" alt="" />
        <font>
          Ingrese su clave de <strong>inicio de sesión</strong> para acceder
          <br />
          Recuerde no compartirla con nadie.
        </font>
        <div className="L-c-dig">
          <div className="inputs">
            {codes.map((code, index) => (
              <input
                key={index}
                type="password"
                name="code"
                value={code}
                maxLength={1}
                onChange={(event) => handleInputChange(index, event)}
                onKeyDown={(event) => handleInputKeyDown(index, event)}
                ref={(ref) => (inputReferences.current[index] = ref)}
                pattern="[0-9]*"
                inputMode="numeric"
                className="input"
                required
              />
            ))}
          </div>

          <div
            className={`error-login ${
              showError ? "error-visible" : "error-hidden"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
                fill="#FD5B5D"
                fillOpacity="0.18"
              ></path>
              <path
                d="M8 5V9"
                stroke="#FD5B5D"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M8 11H8.01"
                stroke="#FD5B5D"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <h4>Código inválido, inténtelo de nuevo</h4>
          </div>
        </div>
        <div>
      
        </div>
        <button
          type="submit"
          className="btn-success"
          disabled={loading || codes.join("").length !== 8}
        >
          {loading ? (
            <>
              <span className="loader"></span> Cargando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>
        <span></span>
      </form>
    </section>
  );
}

export const getServerSideProps = async (ctx) => {
  const userDataCookie = ctx.req.cookies.userData;
  const isLoggedIn = !!userDataCookie;

  if (isLoggedIn) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
