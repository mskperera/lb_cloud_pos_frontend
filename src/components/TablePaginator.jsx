import React from 'react';
import { Paginator } from 'primereact/paginator';

export default function ProductMenuPaginator({ currentPage, rowsPerPage, totalRecords, onPageChange }) {
    return (
        <div className="card">
            <Paginator
                first={currentPage * rowsPerPage} // Calculate the first item index based on current page and rows per page
                rows={rowsPerPage}
                totalRecords={totalRecords}
                className="justify-content-end"
                style={{backgroundColor:'transparent'}}
                rowsPerPageOptions={[10, 20, 30]}
                onPageChange={(e) => onPageChange({ page: e.page, rows: e.rows })} // Adapt the event to your handler's expected format
            />
        </div>
    );
}
