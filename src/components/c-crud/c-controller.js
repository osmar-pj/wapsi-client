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
          "ngrok-skip-browser-warning": true,
        },
      });

      if (response.ok) {
        const data = await response.json();

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
        chip: "",
        ip: "",
      }
    : {
        serie: userToEdit.serie,
        mining: userToEdit.mining?._id,
        chip: userToEdit.chip,
        ip: userToEdit.ip,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        serie: userToEdit.serie,
        mining: userToEdit.mining?._id,
        chip: userToEdit.chip,
        ip: userToEdit.ip,
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
            required
          />
        </div>
      </div>

      <div className="mC-imputs-item">
        <label>Ingrese Chip</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="chip"
            placeholder="Ej. 100"
            required
            value={formData.chip}
            onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese IP</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="ip"
            placeholder="Ej. 100"
            required
            value={formData.ip}
            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
          />
        </div>
      </div>
    </Crud>
  );
}
