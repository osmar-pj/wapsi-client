import { useEffect, useState } from "react";
import Select from "react-select";
import Crud from "./c-crud";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataInstruments } from "@/src/libs/api";


export default function CreateController({
  isCreateUser,
  setCreate,
  refetchData,
  userToEdit,
  url,
}) {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useMainContext();

  const fetchData = async (authTokens) => {
    setLoading(true);
    try {
      const data = await DataInstruments(authTokens.empresa);
      setInstruments(data);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData(authTokens);
  }, [authTokens]);
  

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

  const optionsInstruments = instruments
    .filter((i) => i.ubication === null)
    .map((i) => ({
      value: i._id,
      label: i.name,
      mining: i.controllerId.mining.name,
      serie: i.controllerId.serie,
    }));

  console.log(instruments);

  const handleRolesChange = (selectedOptions) => {
    const selectedRoleValues = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      groups: selectedRoleValues,
    });
  };

  console.log(userToEdit);

  const formatOptionLabel = ({ serie, label, mining }) => (
    <div>
      <span>{label}</span>
      <span style={{ color: "gray" }}> {mining} </span>
      <span style={{ color: "gray" }}> {serie} </span>
    </div>
  );

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
            formatOptionLabel={formatOptionLabel}
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
