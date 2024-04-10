import { useEffect, useState } from "react";
import Select from "react-select";
import Crud from "./c-crud";
import { DataControllers } from "@/src/libs/api";

export default function CreateController({
  isCreateUser,
  setCreate,
  refetchData,
  userToEdit,
  url,
}) {
  const [controller, setController] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await DataControllers();
      if (data !== null) {
      setController(data.controllers);
    }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        controllerId: userToEdit.controllerId._id,
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
        controllerId: userToEdit.controllerId._id,
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

 
  const listType = [
    { id: "sensor", name: "Sensor" },
    { id: "actuator", name: "Actuador" },
  ];
  const listMode = [
    { id: "auto", name: "Automático" },
    { id: "manual", name: "Manual" },
    { id: "auto/manual", name: "Automático/Manual" },
  ];
  const listSignal = [
    { id: "digital", name: "Digital" },
    { id: "analog", name: "Analógico" },
  ];

  const handleTypeChange = (selectedOption) => {
    setFormData({
      ...formData,
      type: selectedOption.id,
    });
  };

  const handleModeChange = (selectedOption) => {
    setFormData({
      ...formData,
      mode: selectedOption.id,
    });
  };
  const handleSignalChange = (selectedOption) => {
    setFormData({
      ...formData,
      signal: selectedOption.id,
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
            required
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
          <Select
            instanceId="react-select-instance"
            name="type"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleTypeChange}
            options={listType}
            value={listType.find((opt) => opt.id === formData.type)}
            placeholder="Seleccione..."
            getOptionLabel={(option) => option.name} // Solo obtenemos el nombre de la opción
            getOptionValue={(option) => option.id} // Obtenemos el ID de la opción
            required
         />

        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Modo</label>
        <div className="imputs-i-input">
        <Select
            instanceId="react-select-instance"
            name="mode"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleModeChange}
            options={listMode}
            value={listMode.find((opt) => opt.id === formData.mode)}
            placeholder="Seleccione..."
            getOptionLabel={(option) => option.name} // Solo obtenemos el nombre de la opción
            getOptionValue={(option) => option.id} // Obtenemos el ID de la opción
            required
          />
          
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Señal</label>
        <div className="imputs-i-input">
        <Select
            instanceId="react-select-instance"
            name="signal"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleSignalChange}
            options={listSignal}
            value={listSignal.find((opt) => opt.id === formData.signal)}
            placeholder="Seleccione..."
            getOptionLabel={(option) => option.name} // Solo obtenemos el nombre de la opción
            getOptionValue={(option) => option.id} // Obtenemos el ID de la opción
            required
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
        <label className="verify">*Serie (Verificar)</label>
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
