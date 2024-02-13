import { useEffect, useState } from "react";
import Crud from "./c-crud";

export default function CreateCompany({
  isCreateUser,
  setCreate,
  refetchData,
  token,
  userToEdit,
  url,
}) {
  const initialValues = isCreateUser
    ? {
        ruc: "",
        name: "",
        address: "",
      }
    : {
        ruc: userToEdit.ruc,
        name: userToEdit.name,
        address: userToEdit.address,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        ruc: userToEdit.ruc,
        name: userToEdit.name,
        address: userToEdit.address,
      });
    }
  }, [isCreateUser, userToEdit]);

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
          name="ruc"
          inputMode="text"
          className="input-f"
          placeholder="Ingrese RUC"
          required
          value={formData.ruc}
          onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
        />
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
        <input
          type="text"
          name="address"
          inputMode="text"
          className="input-f"
          placeholder="Ingrese Dirección"
          required
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
    </Crud>
  );
}
