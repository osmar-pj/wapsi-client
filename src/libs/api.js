export async function DataInstruments(token) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/instrument`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
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

export async function DataGroups(token) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/groupInstrument`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
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

export async function DataControllers(token) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/controller`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      },
    });

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
      `${process.env.API_URL}/api/v1/bigdata?instrumentId=${selectedOption}&start=${startDate}&end=${endDate}`,
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

export async function DataGrafAdvance(selectedOption) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  const end = new Date();

  try {
    const response = await fetch(
      `${
        process.env.API_URL
      }/api/v1/bigdata/analytics/advanced?instrumentId=${selectedOption}&start=${start.getTime()}&end=${end.getTime()}`,
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

export async function DataRelations(token) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/relation`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
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

export async function UpdateInstrument(token, id, finalData) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/instrument/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
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

export async function UpdateRelations(token, dataToSend) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/relation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(dataToSend),
    });

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

export async function DataCompanys (token) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/empresa`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error al obtener datos:", response.statusText);
    }
   
  } catch (error) {
    console.error("Error en la solicitud:", error);
    
  }
};

export async function DataUsers (token) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error al obtener datos:", response.statusText);
    }
   
  } catch (error) {
    console.error("Error en la solicitud:", error);
    
  }
};