import { useEffect, useState } from "react";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataCompanys } from "@/src/libs/api";

import { Select } from "antd";
import Crud from "./c-crud";

export default function CreateUser({
  isCreateUser,
  setCreate,
  refetchData,
  userToEdit,
  url,
}) {
  const { authTokens } = useMainContext();
  const [companys, setCompanys] = useState([]);

  useEffect(() => {
    const fetchDataCompanys = async () => {
      const data = await DataCompanys(authTokens.token);
      setCompanys(data);
    };

    fetchDataCompanys();
  }, []);

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

  const optionsEmpresas = companys?.map((emp) => ({
    value: emp.name,
    label: emp.name,
  }));


  const optionsRoles = [
    { value: "64b71f2871d55d7edf317942", label: "user" },
    { value: "64b71f2871d55d7edf317943", label: "moderator" },
  ];

  const handleRolesChange = (selectedOptions) => {
    const selectedRoleValues = selectedOptions.map((option) => option.id);
    setFormData({
      ...formData,
      roles: selectedRoleValues,
    });
  };

  console.log(formData)

  const handleCompanyChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      empresa: selectedOption.value,
    }));
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
            name="period"
            onSelect={handleCompanyChange}
            value={optionsEmpresas ? optionsEmpresas.find((opt) => opt.value === formData.empresa) : null}

            placeholder="Seleccione..."
            options={optionsEmpresas}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Rol</label>
        <div className="imputs-i-input">
          <Select
            name="roles"
            mode="multiple"
            maxCount={3}
            style={{
              width: '100%',
            }}
            onChange={handleRolesChange}
            value={optionsRoles?.find((opt) =>
              formData.roles.includes(opt.name)
            )}
            placeholder="Seleccione..."
            
            required
            options={optionsRoles}
          />
        </div>
      </div>
      <div className="mC-imputs-item"></div>
      <div className="mC-imputs-item"></div>
    </Crud>
  );
}
