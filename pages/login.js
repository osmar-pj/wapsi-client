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
      <div className="w-Login">
        <form action="" onSubmit={handleSubmit}>
          {loading ? (
            <Loader className="loader"/>
          ) : (
            <>
              <div className="Login-title">
                <h2>WAPSI-SOLUTIONS</h2>
              </div>
              <div className="Login-content">
                <svg className="svg" width="100%" height="100%">
                  <rect
                    className="rect"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx="1"
                    ry="10"
                  />
                </svg>

                <div className="cd"></div>
                <div className="cd2"></div>
                <div className="cd3"></div>
                <div className="cd4"></div>
                <label>INGRESE CÓDIGO:</label>
                <div className="L-c-dig">
                  <div className="inputs">
                    {codes.map((code, index) => (
                      <input
                        key={index}
                        type="text"
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
                  <button
                    type="submit"
                    disabled={loading || codes.join("").length !== 8}
                  >
                    <Marc />
                  </button>
                </div>
              </div>
            </>
          )}
          {showMessage && (
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
          )}

          {errors.code && <h4>{errors.code}</h4>}
        </form>
      </div>
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