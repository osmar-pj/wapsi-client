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
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fecthData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/instrument`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setInstruments(data);
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
        groups: [],
        name: "",
        description: "",
        img: "",
        ubication: "",
        position: {
          x: "",
          y: "",
        },
        installation: "",
      }
    : {
        groups: userToEdit.groups.map((i) => i._id),
        name: userToEdit.name,
        description: userToEdit.description,
        img: userToEdit.img,
        ubication: userToEdit.ubication,
      
        position: {
            x: userToEdit.position.x,
            y: userToEdit.position.y,
          },
        installation: userToEdit.installation,
      };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (!isCreateUser && userToEdit) {
      setFormData({
        groups: userToEdit.groups.map((i) => i._id),
        name: userToEdit.name,
        description: userToEdit.description,
        img: userToEdit.img,
        ubication: userToEdit.ubication,
        position: {
            x: userToEdit.position.x,
            y: userToEdit.position.y,
          },
        installation: userToEdit.installation,
      });
    }
  }, [isCreateUser, userToEdit]);

  const optionsInstruments = instruments.map((i) => ({
    value: i._id,
    label: i.name,
  }));

  const handleRolesChange = (selectedOptions) => {
    const selectedRoleValues = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      groups: selectedRoleValues,
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
      <div className="mC-imputs-item">
        <label>Instrumentos</label>
        <div className="imputs-i-input">
          <Select
            instanceId="react-select-instance"
            name="roles"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            isMulti
            onChange={handleRolesChange}
            options={optionsInstruments}
            value={optionsInstruments.find(
              (opt) => opt.value === formData.empresa
            )}
            placeholder="Seleccione..."
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Nombre</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="name"
            placeholder="Ej. Nombre"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Descripción</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="description"
            placeholder="Ej. Descripción"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese nombre imagen</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="img"
            placeholder="Ej. Subterraneo"
            required
            value={formData.img}
            onChange={(e) => setFormData({ ...formData, img: e.target.value })}
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Ubicación</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="ubication"
            placeholder="Ej. ubicacion"
            required
            value={formData.ubication}
            onChange={(e) =>
              setFormData({ ...formData, ubication: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mC-imputs-item">
        <label>Ingrese Top</label>
        <div className="imputs-i-input">
          <input
            type="number"
            name="x"
            placeholder="Ej. 100"
            required
            value={formData.position.x}
            onChange={(e) =>
              setFormData({
                ...formData,
                position: {
                  ...formData.position,
                  x: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Left</label>
        <div className="imputs-i-input">
        <input
            type="number"
            name="y"
            placeholder="Ej. 100"
            required
            value={formData.position.y}
            onChange={(e) =>
              setFormData({
                ...formData,
                position: {
                  ...formData.position,
                  y: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div className="mC-imputs-item">
        <label>Ingrese Instalación</label>
        <div className="imputs-i-input">
          <input
            type="text"
            name="installation"
            placeholder="Ej. Nivel 9"
            required
            value={formData.installation}
            onChange={(e) =>
              setFormData({ ...formData, installation: e.target.value })
            }
          />
        </div>
      </div>
    </Crud>
  );
}
