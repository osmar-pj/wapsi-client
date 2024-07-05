import { useEffect, useState } from "react";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataCompanys, DataRoles } from "@/src/libs/api";

import Select from "react-select";
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
  const [listRoles, setlistRoles] = useState([]);
  
  useEffect(() => {
    const fetchDataCompanys = async () => {
      const data = await DataCompanys(authTokens.token);
      setCompanys(data);
    };

    const fetchDataRoles = async () => {
      const data = await DataRoles(authTokens.token);
      setlistRoles(data);
    };
    fetchDataCompanys();
    fetchDataRoles();
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
        roles: userToEdit,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        empresa: userToEdit.empresa,
        name: userToEdit.name,
        lastname: userToEdit.lastname,
        dni: userToEdit.dni,
        roles: userToEdit
      });
    }
  }, [isCreateUser, userToEdit]);

  const optionsEmpresas = companys?.map((emp) => ({
    value: emp.name,
    label: emp.name,
  }));

  const optionsRoles = listRoles?.map((emp) => ({
    value: emp._id,
    label: emp.name,
  }));

  // const optionsRoles = [
  //   { value: "64b71f2871d55d7edf317942", label: "user" },
  //   { value: "64b71f2871d55d7edf317943", label: "moderator" },
  // ];

  // console.log(formData);

  const handleCompanyChange = (selectedOption) => {
    setFormData({
      ...formData,
      empresa: selectedOption.value,
    });
  };

  const handleRolesChange = (selectedOptions) => {
    setFormData({
      ...formData,
      roles: selectedOptions.value,
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
            name="empresa"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleCompanyChange}
            value={optionsEmpresas?.find(
              (opt) => opt.value === formData.empresa
            )}
            placeholder="Seleccione..."
            options={optionsEmpresas}
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
            maxCount={3}
            style={{
              width: "100%",
            }}
            onChange={handleRolesChange}
            // value={optionsRoles?.find((opt) =>
            //   formData.roles.includes(opt.name)
            // )}
            value={optionsRoles?.find((opt) => opt.value === formData.roles)}
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
