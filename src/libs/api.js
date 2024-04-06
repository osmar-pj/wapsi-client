

export async function DataInstruments(empresa) {

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/instrument?empresa=${empresa}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function DataGroups(empresa) {

  
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/groupInstrument?empresa=${empresa}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


export async function DataControllers() {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/controller`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "x-access-token": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function DataGrafBasic(selectedOption, startDate, endDate) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/bigData?instrumentId=${selectedOption}&start=${startDate}&end=${endDate}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function DataGrafAdvance(selectedOption) {
  console.log(selectedOption)


  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  const end = new Date();

  try {
    const response = await fetch(
      `${
        process.env.API_URL
      }/api/v1/bigdata/analytics/advanced?instrumentId=${selectedOption}&start=${start.getTime()}&end=${end.getTime()}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function DataRelations(empresa) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/relation?empresa=${empresa}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "x-access-token": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function DeleteRelations(id) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/relation/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "ngrok-skip-browser-warning": true,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function UpdateInstrument(id, finalData) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/instrument/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "x-access-token": token,
        },
        body: JSON.stringify(finalData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function UpdateRelations(dataToSend) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/relation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSend),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function UpdateVentilator(id, newData) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/bigdata/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error en la petición");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}