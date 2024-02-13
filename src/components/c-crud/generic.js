import { useState } from "react";
import { TableConfig } from "@/src/hooks/tableConfig";
import CreateUser from "./c-user";
import DeleteForm from "./c-delete";
import View from "@/src/hooks/view";
import Delete from "@/src/Icons/delete";
import Edit from "@/src/Icons/edit";
import CreateCompany from "./c-company";
import CreateController from "./c-controller";

function GenericList({
  url,
  title,
  token,
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
          <button onClick={() => handleEdit(row.original._id, "user")}>
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
          <button onClick={() => handleEdit(row.original._id, "empresa")}>
            <Edit />
          </button>
          <button onClick={() => handleDelete(row.original._id, "empresa")}>
            <Delete />
          </button>
        </div>
      ),
    },
  ];

  const controllerColumns = [
    {
      header: "Empresa",
      accessorKey: "name", 
      cell: ({ row }) => (
        <div className="td-user">
          <div className="t-name">
            <h4>{row.original.mining.name}</h4>
            <h5>{row.original.ubication}</h5>
          </div>
        </div>
      ),    
    },
    
    {
      header: "Nivel",
      accessorKey: "level",     
    },
    {
      header: "Top",
      accessorKey: "top",     
    },
    {
      header: "Left",
      accessorKey: "left",     
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
          <button onClick={() => handleEdit(row.original._id, "controller")}>
            <Edit />
          </button>
          <button onClick={() => handleDelete(row.original._id, "controller")}>
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

  const handleEdit = async (_id, url) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/${url}/${_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": token,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserToEdit(data);
        setCreate(true);
        setIsCreateUser(false);
      } else {
        console.error("Error al obtener datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
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
          token={token}
          userToEdit={userToEdit}
          isCreateUser={isCreateUser}
          url={url}
          userId={userId}
        />
      )}
      {delet && (
        <DeleteForm
          token={token}
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
