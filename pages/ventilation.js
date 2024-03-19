import ConexionSocket from "@/src/hooks/ConexionSocket";

let categoriaSafety = "ventilation";

export default function Safety({ empresa, roles }) {
  return (
    <ConexionSocket
      empresa={empresa}
      roles={roles}
      categoria={categoriaSafety}
    />
  );
}