import { useEffect, useState } from "react";
import Select from "react-select";
import Crud from "./c-crud";
import { useMainContext } from "@/src/contexts/Main-context";

export default function CreateController({
  isCreateUser,
  setCreate,
  refetchData,
  userToEdit,
  url,
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useMainContext();
  const fecthData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": authTokens.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCompanies(data.empresas);
      } else {
        console.error("Error al obtener datos:", response.statusText);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  const initialValues = isCreateUser
    ? {
        serie: "",
        mining: "",
        ubication: "",
        level: "",
        top: "",
        left: "",
      }
    : {
        serie: userToEdit.serie,
        mining: userToEdit.mining,
        ubication: userToEdit.ubication,
        level: userToEdit.level,
        top: userToEdit.top,
        left: userToEdit.left,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        serie: userToEdit.serie,
        mining: userToEdit.mining,
        ubication: userToEdit.ubication,
        level: userToEdit.level,
        top: userToEdit.top,
        left: userToEdit.left,
      });
    }
  }, [isCreateUser, userToEdit]);

  const optionsEmpresas = companies.map((emp) => ({
    value: emp._id,
    label: emp.name,
  }));

  const handleAreaChange = (selectedOption) => {
    setFormData({
      ...formData,
      mining: selectedOption.value,
    });
  };

  console.log(userToEdit);

  return (
    <Crud
      isCreateUser={isCreateUser}
      setCreate={setCreate}
      userToEdit={userToEdit}
      formData={formData}
      refetchData={refetchData}
      url={url}
    >
      <div className="mC-imputs-item">
        <label>Ingrese Serie</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="serie"
            placeholder="Ej. D24-0001"
            required
            value={formData.serie}
            onChange={(e) =>
              setFormData({ ...formData, serie: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mC-imputs-item">
        <label>Mina</label>
        <div className="imputs-i-input">
          <Select
            instanceId="react-select-instance"
            name="period"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleAreaChange}
            options={optionsEmpresas}
            value={optionsEmpresas.find((opt) => opt.value === formData.mining)}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Ubicación</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="ubication"
            placeholder="Ej. Subterraneo"
            required
            value={formData.ubication}
            onChange={(e) =>
              setFormData({ ...formData, ubication: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mC-imputs-item">
        <label>Ingrese Nivel</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="level"
            placeholder="Ej. Nivel 9"
            required
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Top</label>
        <div className="imputs-i-input">
          <input
            type="number"
            name="top"
            placeholder="Ej. 100"
            required
            value={formData.top}
            onChange={(e) => setFormData({ ...formData, top: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Left</label>
        <div className="imputs-i-input">
          <input
            type="number"
            name="left"
            placeholder="Ej. 100"
            required
            value={formData.left}
            onChange={(e) => setFormData({ ...formData, left: e.target.value })}
          />
        </div>
      </div>
    </Crud>
  );
}
