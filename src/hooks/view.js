import { flexRender } from "@tanstack/react-table";
import Reg from "../Icons/reg";
import Select from "react-select";
import DropLeft from "../Icons/drop-left";
import DropRight from "../Icons/drop-right";
import More from "../Icons/more";

let ascIcon = "/imgs/i-up-arrow.svg";
let descIcon = "/imgs/i-down-arrow.svg";

export default function View({
  filtering,
  table,
  setCreate,
  title,
  setFiltering,
  setIsCreateUser,
  loading,
}) {
  return (
    <>
      <div className="Container-title">
        <div className="D-title-name">
          <div>
            <Reg />
          </div>
          <h2>{title} </h2>
          
        </div>
        <div className="D-title-more">
          <button className="btn-acept" onClick={() => setCreate(true) & setIsCreateUser(true)}>
            <More/> Crear nuevo
          </button>
        </div>
      </div>
      <div className="Container-table">
        <div className="C-table-header">
          <div className="c-t-h-search">
            <input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Buscar por nombre..."
            />
          </div>
          <div className="c-t-h-items">
            Items:
            <Select
              instanceId="react-select-instance"
              name="period"
              classNamePrefix="custom-select"
              isSearchable={false}
              isClearable={false}
              placeholder="Seleccione..."
              value={
                {
                  value: table.getState().pagination.pageSize,
                  label: table.getState().pagination.pageSize.toString(),
                }
              }
              onChange={(selectedOption) => {
                table.setPageSize(Number(selectedOption.value));
              }}
              options={[
                { value: 10, label: "10" },              
                { value: 20, label: "25" },
                { value: 50, label: "50" },
              ]}
            />
          </div>
        </div>
        <div className="C-table-body">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <th>IT</th>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() === "asc" && (
                            <img src={ascIcon} alt="Ascending" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <img src={descIcon} alt="Descending" />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((i, index) => (
                    <tr key={index}>
                      <td>--</td>
                      {table
                        .getHeaderGroups()[0]
                        .headers.map((i, columnIndex) => (
                          <td key={columnIndex}>--</td>
                        ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row, index) => (
                    <tr key={row.id}>
                      <td>#{index + 1}</td>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="C-table-footer">
          <div className="c-t-footer-page">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <DropLeft />
            </button>
            <span className="">
              Página{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <DropRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
