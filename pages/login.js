import { useEffect, useRef, useState } from "react";
import ValidLogin from "@/src/hooks/ValidLogin";
import Marc from "@/src/Icons/marc";
import Loader from "@/src/Icons/loader";

export default function Login() {
  const [codes, setCodes] = useState(Array(8).fill(""));
  const [showMessage, setShowMessage] = useState(false);
  const inputReferences = useRef([]);

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
    setCodes(Array(8).fill(""));
  };

  const onValidate = (form) => {
    let errors = {};
    let regexNumber = /^[ 0-9]+$/;

    if (!form.code.trim()) {
      errors.code = '*The "Phone" field must not be empty.';
    } else if (!regexNumber.test(form.code)) {
      errors.code = '*The "Phone" field only accepts numbers and spaces';
    }
    return errors;
  };

  const combinedValue = codes.join("");
  const initialData = { code: combinedValue };

  const { errors, loading, loginStatus, handleSubmit } = ValidLogin(
    initialData,
    onValidate,
    resetForm
  );

  useEffect(() => {
    if (loading) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1500);
    }
  }, [loading]);

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
        <h2 className="Login-title">Wapsi-Solutions</h2>
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
        {errors.code && (
          <h4>
            
            {errors.code}
          </h4>
        )}
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

      {/* {showMessage && (
        <>
          {loginStatus === true ? (
            <h3 className="Login-access">
              ACCESO ACEPTADO:
              <strong className="L-green">CONTRASEÑA CORRECTA</strong>
            </h3>
          ) : loginStatus === false ? (
            <h3 className="Login-access">
              ACCESO DENEGADO:
              <strong className="L-red">CONTRASEÑA INCORRECTA</strong>
            </h3>
          ) : null}
        </>
      )} */}
    </section>
  );
}

export const getServerSideProps = async (ctx) => {
  const userDataCookie = ctx.req.cookies.userData;
  const isLoggedIn = !!userDataCookie;

  if (isLoggedIn) {
    return {
      redirect: {
        destination: "/safety",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
