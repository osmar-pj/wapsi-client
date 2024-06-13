import { flexRender } from "@tanstack/react-table";
import { motion } from "framer-motion";
import Select from "react-select";
import DropLeft from "../Icons/drop-left";
import DropRight from "../Icons/drop-right";
import More from "../Icons/more";
import React, { useState } from "react";
import Search from "../Icons/search";

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
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < pageCount) {
      setCurrentPageIndex(pageIndex);
      table.setPageIndex(pageIndex);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Número máximo de números de página a mostrar

    let startPage = currentPageIndex - Math.floor(maxPageNumbers / 2);
    let endPage = currentPageIndex + Math.floor(maxPageNumbers / 2);

    if (startPage < 0) {
      startPage = 0;
      endPage = Math.min(pageCount - 1, maxPageNumbers - 1);
    }

    if (endPage >= pageCount) {
      endPage = pageCount - 1;
      startPage = Math.max(0, pageCount - maxPageNumbers);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPageIndex;
      pageNumbers.push(
        <button
          key={i}
          className={isActive ? "f-active" : "f-inactive"}
          onClick={() => goToPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return pageNumbers;
  };

  const [visibleColumns, setVisibleColumns] = useState(
    table.headers?.map((header) => header.id)
  );

  // Función para cambiar la visibilidad de las columnas
  const toggleColumnVisibility = (e) => {
    const selectedColumns = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setVisibleColumns(selectedColumns);
  };

  return (
    <>
      <div className="Container-title">
        <div className="D-title-name">
          <h2>{title} </h2> {table.rows && table.rows.length}
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
              className="input-search"
            />
            <Search />
          </div>
          <div>
            <select
              multiple
              value={visibleColumns}
              onChange={toggleColumnVisibility}
            >
              {table.headers?.map((header) => (
                <option key={header.id} value={header.id}>
                  {header.id}
                </option>
              ))}
            </select>
          </div>
          <div className="D-title-more">
            <button
              className="btn-acept"
              onClick={() => setCreate(true) & setIsCreateUser(true)}
            >
              Añadir nuevo <More />
            </button>
          </div>
        </div>
        <div className="C-table-body">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <React.Fragment key={index}>
                  <tr key={`header-${headerGroup.id}`}>
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
                  <tr key={`empty-row-${index}`} className="nexrui"></tr>
                </React.Fragment>
              ))}
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 9 }).map((_, index) => (
                  <tr key={`loading-row-${index}`}>
                    {table
                      .getHeaderGroups()[0]
                      .headers.map((i, columnIndex) => (
                        <td key={`loading-cell-${index}-${columnIndex}`}>
                          <div className="thumb pulse"></div>
                        </td>
                      ))}
                  </tr>
                ))
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={`data-row-${row.id}`}
                    initial={{ opacity: 0, y: "-0.9em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                  >
                    <td className="td-id">
                      <span>#{index + 1}</span>
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) }
            </tbody>
          </table>
        </div>

        <div className="C-table-footer">
          <span className="c-t-footer-select">0 of 20 selected</span>

          <div className="c-t-footer-page">
            <button
              className="btn-pages"
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
                setCurrentPageIndex(currentPageIndex - 1);
              }}
            >
              <DropLeft />
            </button>
            <div className="f-pages-btns">{renderPageNumbers()}</div>
            <button
              className="btn-pages"
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
                setCurrentPageIndex(currentPageIndex + 1);
              }}
            >
              <DropRight />
            </button>
          </div>
          <div className="c-t-footer-items">
            Items:
            <select
              id="period"
              name="period"
              className="custom-select"
              onChange={(event) => {
                const selectedPageSize = parseInt(event.target.value);
                table.setPageSize(selectedPageSize);
              }}
              value={table.getState().pagination.pageSize}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
