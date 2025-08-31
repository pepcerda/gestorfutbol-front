import "./tablecomponent.css";
import React, {useState, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {useTranslation} from "react-i18next";

const getValue = (row, field) =>
    field.split(/\./u).reduce((acc, curr) => {
        if (acc?.[curr]) {
            return acc[curr];
        }

        return undefined;
    }, row);

const TableComponent = ({props}) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {t, i18n} = useTranslation("common");

    return (
        <div className="table-component-wrapper p-fluid">
            <DataTable
                value={props.data}
                className={`table-component ${props.className}`}
                selectionMode={props.selectionMode}
                paginatorClassName="table-paginator"
                paginatorDropdownAppendTo="self"
                selection={props.selectedData}
                onSelectionChange={props.onChangeSelectedDataEvent}
                metaKeySelection={false}
                paginator={props.paginator}
                paginatorPosition={props.paginatorPosition}
                rows={props.rows}
                rowsPerPageOptions={props.rowsPerPageOptions}
                onRowUnselect={props.onRowUnselect}
                lazy={props.lazy}
                first={props.first}
                totalRecords={props.totalRecords}
                onPage={props.onPage}
                onSort={props.onSort}
                sortOrder={props.sortOrder}
                sortField={props.sortField}
                editMode={props.editMode}
                onRowEditComplete={props.onRowEditComplete}
                showGridlines={props.showGridlines}
                stripedRows={props.stripedRows}
                onFilter={props.onFilter}
                filterDisplay={props.filterDisplay}
            >
                {props.columns
                    .map((c, idx) => (
                    <Column
                        key={c.field}
                        field={c.field}
                        body={(row, {field}) => (
                            <>
                                <span className="p-column-title">{c.header}</span>
                                {getValue(row, field)}
                            </>
                        )}
                        {...c}
                    />
                ))}

                {props.rowEditor && (
                    <Column
                        rowEditor={props.rowEditor}
                        headerStyle={{width: "10%", minWidth: "8rem"}}
                        bodyStyle={{textAlign: "center"}}
                    />
                )}

            </DataTable>
        </div>
    );
};

export default TableComponent;
