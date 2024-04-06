import { useEffect, useState } from "react";
import Select from "react-select";
import Crud from "./c-crud";
import { useMainContext } from "@/src/contexts/Main-context";

export default function CreateUser({
  isCreateUser,
  setCreate,
  refetchData,

  userToEdit,
  url,
}) {
  const [users, setUsers] = useState({
    rolesFiltered: [],
    empresas: [],
  });
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
        setUsers({
          rolesFiltered: data.rolesFiltered,
          empresas: data.empresas,
        });
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

  const { rolesFiltered, empresas } = users;

  const initialValues = isCreateUser
    ? {
        empresa: "",
        name: "",
        lastname: "",
        dni: "",
        roles: [],
      }
    : {
        empresa: userToEdit.empresa,
        name: userToEdit.name,
        lastname: userToEdit.lastname,
        dni: userToEdit.dni,
        roles: userToEdit.roles.map((rol) => rol._id),
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        empresa: userToEdit.empresa,
        name: userToEdit.name,
        lastname: userToEdit.lastname,
        dni: userToEdit.dni,
        roles: userToEdit.roles.map((rol) => rol._id),
      });
    }
  }, [isCreateUser, userToEdit]);

  const optionsEmpresas = empresas.map((emp) => ({
    value: emp.name,
    label: emp.name,
  }));

  const optionsRoles = rolesFiltered.map((rol) => ({
    value: rol._id,
    label: rol.name,
  }));

  const handleRolesChange = (selectedOptions) => {
    const selectedRoleValues = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      roles: selectedRoleValues,
    });
  };

  const handleAreaChange = (selectedOption) => {
    setFormData({
      ...formData,
      empresa: selectedOption.value,
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
        <label>Ingrese Nombres</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="name"
            inputMode="text"
            placeholder="Ingrese Nombre"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Apellidos</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="lastname"
            inputMode="text"
            placeholder="Ingrese Apellido"
            required
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese DNI</label>
        <div className="imputs-i-input">
          <input
            type="number"
            name="dni"
            min="0"
            max="99999999"
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Ingrese DNI"
            required
            value={formData.dni}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 8) {
                setFormData({ ...formData, dni: inputValue });
              }
            }}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Empresa</label>
        <div className="imputs-i-input">
          <Select
            instanceId="react-select-instance"
            name="period"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleAreaChange}
            options={optionsEmpresas}
            value={optionsEmpresas.find(
              (opt) => opt.value === formData.empresa
            )}
            placeholder="Seleccione..."
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Rol</label>
        <div className="imputs-i-input">
          <Select
            instanceId="react-select-instance"
            name="roles"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            isMulti
            onChange={handleRolesChange}
            options={optionsRoles}
            value={optionsRoles.filter((opt) =>
              formData.roles.includes(opt.value)
            )}
            placeholder="Seleccione..."
          />
        </div>
      </div>
      <div className="mC-imputs-item"></div>
      <div className="mC-imputs-item"></div>
    </Crud>
  );
}
