import { useState } from "react";
import { TableConfig } from "@/src/hooks/tableConfig";
import CreateUser from "./c-user";
import DeleteForm from "./c-delete";
import View from "@/src/hooks/view";
import Delete from "@/src/Icons/delete";
import Edit from "@/src/Icons/edit";
import CreateCompany from "./c-company";
import CreateController from "./c-controller";
import CreateInstrument from "./c-instrument";
import CreateGroupInstrument from "./c-group";

function GenericList({
  url,
  title,
  userId,
  usersFiltered2,
  loading,
  refetchData,
}) {
  const [create, setCreate] = useState(false);
  const [delet, setDelet] = useState(false);
  const [filtering, setFiltering] = useState("");
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState("");
  const [userToDeleteId, setUserToDeleteId] = useState(null);

  const getInitials = (name) => {
    const names = name.split(" ");
    return names[0][0];
  };

  function formatFecha(dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return ` ${day} ${monthNames[monthIndex]} ${year}, ${formattedHours}:${formattedMinutes}`;
  }

  const userColumns = [
    {
      header: "Usuario",
      accessorKey: "name",
      cell: ({ row }) => {
        const initials = getInitials(row.original.name);

        const spanStyle = {
          backgroundColor: row.original.bg,
        };

        return (
          <div className="td-user">
            <span className="t-siglas" style={spanStyle}>
              {initials}
            </span>
            <div className="t-name">
              <h4>
                {row.original.name} {row.original.lastname}
              </h4>
              <h5>{row.original.dni}</h5>
            </div>
          </div>
        );
      },
    },

    {
      header: "Roles",
      accessorKey: "roles",
      cell: ({ row }) => {
        return <h4>{row.original.roles[0].name}</h4>;
      },
    },

    {
      header: "Empresa",
      accessorKey: "empresa",
      cell: ({ row }) => (
        <div className="td-user">
          <div className="t-name">
            <h4>{row.original.empresa}</h4>
            <h5>{row.original.area}</h5>
          </div>
        </div>
      ),
    },
    {
      header: "Fecha de creación",
      accessorKey: "lastname",
      cell: ({ row }) => formatFecha(row.original.createdAt),
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="btns">
          <button onClick={() => handleEdit(row.original)}>
            <Edit />
          </button>
          <button onClick={() => handleDelete(row.original._id, "user")}>
            <Delete />
          </button>
        </div>
      ),
    },
  ];

  const companyColumns = [
    {
      header: "Empresa",
      accessorKey: "name",
    },
    {
      header: "Empresa",
      accessorKey: "ruc",
    },
    {
      header: "Dirección",
      accessorKey: "address",
    },
    {
      header: "Fecha de creación",
      accessorKey: "lastname",
      cell: ({ row }) => formatFecha(row.original.createdAt),
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="btns">
          <button onClick={() => handleEdit(row.original)}>
            <Edit />
          </button>
          <button onClick={() => handleDelete(row.original._id, "empresa")}>
            <Delete />
          </button>
        </div>
      ),
    },
  ];

  const groupInstrumentColumns = [
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Imagen",
      accessorKey: "img",
    },
    {
      header: "Ubicación",
      accessorKey: "ubication",
    },
    {
      header: "Instlación",
      accessorKey: "installation",
    },
    {
      header: "Posición X",
      cell: ({ row }) => {
        return <h4>{row.original.position.x}</h4>;
      },
    },
    {
      header: "Posición Y",
      cell: ({ row }) => {
        return <h4>{row.original.position.y}</h4>;
      },
    },
    {
      header: "Controladores",
      accessorKey: "empresa",
      cell: ({ row }) => (
        <div className="td-user">
          {row.original.groups.map((group, index) => (
            <div key={index} className="t-name">
              <h4>{group.name}</h4>
              <h4>{group.controllerId.mining.name}</h4>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "Fecha de creación",
      accessorKey: "lastname",
      cell: ({ row }) => formatFecha(row.original.createdAt),
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="btns">
          <button onClick={() => handleEdit(row.original, "groupInstrument")}>
            <Edit />
          </button>
          <button
            onClick={() => handleDelete(row.original._id, "groupInstrument")}
          >
            <Delete />
          </button>
        </div>
      ),
    },
  ];
  const controllerColumns = [
    {
      header: "Serie",
      accessorKey: "serie",
      cell: ({ row }) => (
        <div className="td-user">
          <div className="t-name">
            <h4>{row.original.serie}</h4>
            <h5>{row.original.mining.name}</h5>
          </div>
        </div>
      ),
    },

    {
      header: "Nivel",
      accessorKey: "level",
    },
    {
      header: "Left",
      accessorKey: "left",
    },
    {
      header: "Top",
      accessorKey: "top",
    },
    {
      header: "Ubicación",
      accessorKey: "ubication",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="btns">
          <button onClick={() => handleEdit(row.original)}>
            <Edit />
          </button>
          <button onClick={() => handleDelete(row.original._id, "controller")}>
            <Delete />
          </button>
        </div>
      ),
    },
  ];
  const instrumentColumns = [
    {
      header: "Controlador",
      accessorKey: "controllerId",
      cell: ({ row }) => (
        <div className="td-user">
          <div className="t-name">
            <h4>{row.original.controllerId.serie}</h4>
            <h5>{row.original.controllerId.mining.name}</h5>
          </div>
        </div>
      ),
    },
    {
      header: "Nivel",
      accessorKey: "name",
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Tipo",
      accessorKey: "type",
    },
    {
      header: "Modo",
      accessorKey: "mode",
    },
    {
      header: "Señal",
      accessorKey: "signal",
    },
    {
      header: "Medida",
      accessorKey: "measure",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="btns">
          <button onClick={() => handleEdit(row.original, "groupInstrument")}>
            <Edit />
          </button>
          <button onClick={() => handleDelete(row.original._id, "instrument")}>
            <Delete />
          </button>
        </div>
      ),
    },
  ];
  const urlToColumnsAndComponents = {
    user: {
      columns: userColumns,
      createComponent: CreateUser,
    },
    empresa: {
      columns: companyColumns,
      createComponent: CreateCompany,
    },
    groupInstrument: {
      columns: groupInstrumentColumns,
      createComponent: CreateGroupInstrument,
    },
    instrument: {
      columns: instrumentColumns,
      createComponent: CreateInstrument,
    },

    controller: {
      columns: controllerColumns,
      createComponent: CreateController,
    },
  };

  const selectedConfig = urlToColumnsAndComponents[url] || {
    columns: userColumns,
    createComponent: CreateUser,
  };

  const { columns, createComponent: CreateComponent } = selectedConfig;

  const handleEdit = (rowData, type) => {
    console.log("Datos editados:", rowData);
    setUserToEdit(rowData);
    setCreate(true);
    setIsCreateUser(false);
  };

  const handleDelete = async (_id, url) => {
    try {
      setDelet(true);
      setUserToDeleteId(`${url}/${_id}`);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const table = TableConfig(usersFiltered2, columns, filtering, setFiltering);

  if (loading) {
    return (
      <View
        loading={true}
        filtering={filtering}
        table={table}
        setCreate={setCreate}
        title={title}
        setFiltering={setFiltering}
        setIsCreateUser={setIsCreateUser}
      ></View>
    );
  }

  return (
    <>
      {create && (
        <CreateComponent
          setCreate={setCreate}
          refetchData={refetchData}
          userToEdit={userToEdit}
          isCreateUser={isCreateUser}
          url={url}
          userId={userId}
        />
      )}
      {delet && (
        <DeleteForm
          setDelet={setDelet}
          refetchData={refetchData}
          userToDeleteId={userToDeleteId}
        />
      )}
      <View
        filtering={filtering}
        table={table}
        setCreate={setCreate}
        title={title}
        setFiltering={setFiltering}
        setIsCreateUser={setIsCreateUser}
        loading={loading}
      />
    </>
  );
}

export default GenericList;
