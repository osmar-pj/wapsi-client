import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useMainContext } from "../contexts/Main-context";

const ValidLogin = (initialData, onValidate, resetForm) => {
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [errors, setErrors] = useState({});
  // const { login } = MainProvider();
  const { login } = useMainContext();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = onValidate(initialData);
   
    setErrors(err);

    if (Object.keys(err).length === 0) {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.API_URL}/auth/api/v1/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(initialData),
        });

        const data = await response.json();
        
       
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        setTimeout(() => {
          setLoginStatus(data.status);
        }, 500);
        
        if (data.status === true) {
          
          const cookieData = {
            token: data.token,
            area: data.area,
            roles: data.roles,
            empresa: data.empresa,
            userId: data.userId,
            name: data.user
          };

          Cookies.set("userData", JSON.stringify(cookieData)); 
          const empresa = data.empresa;
          localStorage.setItem("empresa", empresa);
          login(data);               
          router.push("/safety");
        } else {
          resetForm(initialData);
        }
      } catch (error) {
        console.log(error);        
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginStatus(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [loginStatus]);

  return { errors, loading, loginStatus, handleSubmit };
};

export default ValidLogin;
