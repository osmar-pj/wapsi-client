import { flexRender } from "@tanstack/react-table";
import Select from "react-select";
import DropLeft from "../Icons/drop-left";
import DropRight from "../Icons/drop-right";
import More from "../Icons/more";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

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
          <h2>{title} </h2>
        </div>
        <div className="D-title-more">
          <button
            className="btn-acept"
            onClick={() => setCreate(true) & setIsCreateUser(true)}
          >
            <More /> Crear nuevo
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
              value={{
                value: table.getState().pagination.pageSize,
                label: table.getState().pagination.pageSize.toString(),
              }}
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
                <>
                  <tr key={headerGroup.id}>
                    <th>#</th>
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
                              <img src={ascIcon} alt="as" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <img src={descIcon} alt="des" />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                  <tr className="nexrui"> </tr>
                </>
              ))}
            </thead>

            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index}>
                      <td className="td-id">--</td>
                      {table
                        .getHeaderGroups()[0]
                        .headers.map((i, columnIndex) => (
                          <td key={columnIndex}>
                            <SkeletonTheme
                              baseColor="#3a80fa"
                              highlightColor="#5E98FD"
                            >
                              <Skeleton height={10} />
                            </SkeletonTheme>
                          </td>
                        ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: "-0.9em" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                    >
                      <td className="td-id"><span>#{index + 1}</span></td>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <Skeleton containerClassName="flex-1" />
          </div>
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
