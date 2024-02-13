import { useEffect, useState } from "react";
import Select from "react-select";
import Crud from "./c-crud";

export default function CreateController({
  isCreateUser,
  setCreate,
  refetchData,
  token,
  userToEdit,
  url,
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const fecthData = async () => {
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
      token={token}
      userToEdit={userToEdit}
      formData={formData}
      refetchData={refetchData}
      url={url}
    >
      <input
        type="text"
        name="name"
        inputMode="text"
        className="input-f"
        placeholder="Ingrese Serie"
        required
        value={formData.serie}
        onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
      />

      <div className="select-g">
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

      <input
        type="text"
        name="ubication"
        inputMode="text"
        className="input-f"
        placeholder="Ingrese Ubicación"
        required
        value={formData.ubication}
        onChange={(e) =>
          setFormData({ ...formData, ubication: e.target.value })
        }
      />

      <input
        type="text"
        name="level"
        inputMode="text"
        className="input-f"
        placeholder="Ingrese Nivel"
        required
        value={formData.level}
        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
      />
      <input
        type="text"
        name="code"
        pattern="[0-9]*"
        maxLength={8}
        inputMode="numeric"
        className="input-f"
        placeholder="Ingrese Top"
        required
        value={formData.top}
        onChange={(e) => setFormData({ ...formData, top: e.target.value })}
      />
      <input
        type="text"
        name="code"
        pattern="[0-9]*"
        maxLength={8}
        inputMode="numeric"
        className="input-f"
        placeholder="Ingrese Left"
        required
        value={formData.left}
        onChange={(e) => setFormData({ ...formData, left: e.target.value })}
      />
    </Crud>
  );
}
