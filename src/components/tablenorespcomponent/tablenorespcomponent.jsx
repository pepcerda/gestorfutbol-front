import { Column } from 'primereact/column';
import './tablenorespcomponent.css';
import { DataTable } from 'primereact/datatable';

const TableNoRespComponent = ({props})=> {
   return (
      <div>
            <DataTable
                dataKey={props.dataKey}
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
                sortMode={props.sortMode}
                editMode={props.editMode}
                onRowEditComplete={props.onRowEditComplete}
                showGridlines={props.showGridlines}
                stripedRows={props.stripedRows}
                filters={props.filters}
                onFilter={props.onFilter}
                filterDisplay={props.filterDisplay}
                showFilterMatchModes={props.showFilterMatchModes}
                globalFilterFields={props.globalFilterFields}
                footer={props.footer}
                header={props.header}
                rowGroupMode={props.rowGroupMode} 
                groupRowsBy={props.groupRowsBy}
                rowGroupHeaderTemplate={props.rowGroupHeaderTemplate}
                rowGroupFooterTemplate={props.rowGroupFooterTemplate}
                expandableRowGroups={props.expandableRowGroups}
                onRowToggle={props.onRowToggle}
                expandedRows={props.expandedRows}
                onContextMenuSelectionChange={props.onContextMenuSelectionChange}
                contextMenuSelection={props.contextMenuSelection}
                onContextMenu={props.onContextMenu}
                rowExpansionTemplate={props.rowExpansionTemplate}
            >
                {(props.selectionMode === "checkbox" || props.selectionMode === "multiple") && (
                    <Column selectionMode={props.rowSelectionMode}></Column>
                )}
                {(props.rowExpansionTemplate) && (
                    <Column expander={true} style={{ width: '5rem' }} />
                )}
                
                {props.columns
                    .map((c, idx) => (
                    <Column
                        key={c.field}
                        field={c.field}
                        body={c.body}
                        filter={c.filter} // Asegúrate de que esta propiedad esté habilitada
                        filterField={c.filterField}
                        filterFunction={c.filterFunction}
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
        </div>);
}


export default TableNoRespComponent;