import Cookies from "js-cookie";

export async function ValidLogin(initialData, login) {

  try {
    const response = await fetch(`${process.env.API_URL}/auth/api/v1/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(initialData),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === true) {
       
        const cookieData = {
          token: data.token,
          area: data.area,
          roles: data.roles,
          empresa: data.empresa,
          userId: data.userId,
          name: data.user,
        };
        
        Cookies.set("userData", JSON.stringify(cookieData));
        login(data);
        
        return true;
      } else {
        console.error("Error:", error);
        return false;
      }
    } else {
      console.error("Error en la petición");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
