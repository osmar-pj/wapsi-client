import { useEffect, useState } from "react";
import Select from "react-select";
import Crud from "./c-crud";

export default function CreateUser({
  isCreateUser,
  setCreate,
  refetchData,
  token,
  userToEdit,
  url,
}) {
  const [users, setUsers] = useState({
    rolesFiltered: [],
    empresas: [],
  });
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
      token={token}
      userToEdit={userToEdit}
      formData={formData}
      refetchData={refetchData}
      url={url}
    >
      <div className="select-g">
        {/* <label>Nombres</label> */}
        <input
          type="text"
          name="name"
          inputMode="text"
          className="input-f"
          placeholder="Ingrese Nombre"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="select-g">
        {/* <label>Apellidos</label> */}
        <input
          type="text"
          name="lastname"
          inputMode="text"
          className="input-f"
          placeholder="Ingrese Apellido"
          required
          value={formData.lastname}
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value })
          }
        />
      </div>

      <div className="select-g">
        {/* <label>DNI</label> */}
        <input
          type="text"
          name="code"
          pattern="[0-9]*"
          maxLength={8}
          inputMode="numeric"
          className="input-f"
          placeholder="Ingrese DNI"
          required
          value={formData.dni}
          onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
        />
      </div>

      <div className="select-g">
        {/* <label>Empresa</label> */}
        <Select
          instanceId="react-select-instance"
          name="period"
          classNamePrefix="custom-select"
          isSearchable={false}
          isClearable={false}
          onChange={handleAreaChange}
          options={optionsEmpresas}
          value={optionsEmpresas.find((opt) => opt.value === formData.empresa)}
          placeholder="Seleccione..."
        />
      </div>
      <div className="select-g">
        {/* <label>Rol</label> */}
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
    </Crud>
  );
}
