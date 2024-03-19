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
  const [controller, setController] = useState([]);
  const [loading, setLoading] = useState(true);
  const fecthData = async () => {
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
        console.log(data);
        setController(data.controllers);
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
        name: "",
        description: "",
        controllerId: "",

        type: "",
        mode: "",
        signal: "",
        measure: "",
        serie: "",
      }
    : {
        name: userToEdit.name,
        description: userToEdit.description,

        type: userToEdit.type,
        mode: userToEdit.mode,
        signal: userToEdit.signal,
        measure: userToEdit.measure,
        serie: userToEdit.serie,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        name: userToEdit.name,
        description: userToEdit.description,

        type: userToEdit.type,
        mode: userToEdit.mode,
        signal: userToEdit.signal,
        measure: userToEdit.measure,
        serie: userToEdit.serie,
      });
    }
  }, [isCreateUser, userToEdit]);

  const optionsControllers = controller.map((controller) => ({
    value: controller._id,
    label: controller.serie,
  }));

  const handleAreaChange = (selectedOption) => {
    setFormData({
      ...formData,
      controllerId: selectedOption.value,
    });
  };

  //   console.log(userToEdit);

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
      <div className="mC-imputs-item">
        <label>Ingrese Nombre</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="name"
            inputMode="text"
            placeholder="Ej. O2"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Controlador</label>
        <div className="imputs-i-input">
          <Select
            instanceId="react-select-instance"
            name="period"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleAreaChange}
            options={optionsControllers}
            value={optionsControllers.find(
              (opt) => opt.value === formData.controllerId
            )}
          />
        </div>
      </div>

      <div className="mC-imputs-item">
        <label>Ingrese descripción</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="description"
            inputMode="text"
            placeholder="Ingrese descripción"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mC-imputs-item">
        <label>Ingrese Tipo</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="type"
            inputMode="text"
            placeholder="Ingrese Tipo"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Modo</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="mode"
            inputMode="numeric"
            placeholder="Ingrese Modo"
            value={formData.mode}
            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Señal</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="signal"
            placeholder="Ingrese Señal"
            required
            value={formData.signal}
            onChange={(e) =>
              setFormData({ ...formData, signal: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Medida</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="measure"
            placeholder="Ingrese Medida"
            value={formData.measure}
            onChange={(e) =>
              setFormData({ ...formData, measure: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Serie</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="serie"
            placeholder="Ingrese Serie"
            value={formData.serie}
            required
            onChange={(e) =>
              setFormData({ ...formData, serie: e.target.value })
            }
          />
        </div>
      </div>
    </Crud>
  );
}
