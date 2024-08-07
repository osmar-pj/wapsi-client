import { useEffect, useState } from "react";
import Crud from "./c-crud";

export default function CreateCompany({
  isCreateUser,
  setCreate,
  refetchData,
  userToEdit,
  url,
}) {
  const initialValues = isCreateUser
    ? {
        ruc: "",
        name: "",
        address: "",
        phone: "",
        groupName: "",
      }
    : {
        ruc: userToEdit.ruc,
        name: userToEdit.name,
        address: userToEdit.address,
        phone: userToEdit.phone,
        groupName: userToEdit.groupName,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        ruc: userToEdit.ruc,
        name: userToEdit.name,
        address: userToEdit.address,
        phone: userToEdit.phone,
        groupName: userToEdit.groupName,
      });
    }
  }, [isCreateUser, userToEdit]);

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
        <label>Ingrese RUC</label>
        <div className="imputs-i-input">
          <input
            type="number"
            name="ruc"
            min="0"
            max="999999999999" 
            pattern="[0-9]*"
            inputMode="numeric"           
            placeholder="Ej. 97238472647233"
            required
            value={formData.ruc}            
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 12) {
                setFormData({ ...formData, ruc: inputValue });
              }
            }}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Nombre</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="name"
            inputMode="text"
            placeholder="Ej. ANONIMO"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Dirección</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="address"
            inputMode="text"
            placeholder="Ej. Av. anonimo #123"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Celular</label>
        <div className="imputs-i-input">
        <input
            type="text"
            name="phone"
            inputMode="text"           
            placeholder="Ej. +51923432334"
            required
            value={formData.phone}            
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value })
            }}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese nombre de Grupo</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="groupName"
            inputMode="text"
            placeholder="Ej. GRUPO"
            required
            value={formData.groupName}
            onChange={(e) =>
              setFormData({ ...formData, groupName: e.target.value })
            }
          />
        </div>
      </div>
    </Crud>
  );
}
