import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, ChevronDoubleLeft, ChevronDoubleRight } from 'react-bootstrap-icons';

const PaginationComponent = ({
    rowsPerPage,
    currentPage,
    totalRows,
    handleRowsPerPageChange,
    handlePageChange
}) => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const firstItemIndex = currentPage * rowsPerPage + 1;
    const lastItemIndex = Math.min((currentPage + 1) * rowsPerPage, totalRows);

    // Handlers for first, previous, next, and last page buttons
    const goToFirstPage = () => handlePageChange(0);
    const goToPreviousPage = () => handlePageChange(currentPage - 1);
    const goToNextPage = () => handlePageChange(currentPage + 1);
    const goToLastPage = () => handlePageChange(totalPages - 1);

    // Handle direct page input
    const handlePageInput = (e) => {
        const page = Math.max(0, Math.min(totalPages - 1, parseInt(e.target.value) - 1));
        handlePageChange(page);
    };

    return (
        <Row >
            {/* Items per page dropdown (left aligned) */}
            <Col >
                <label htmlFor="rowsPerPage" className="me-2">Items per page:</label>
                <Form.Select 
                    value={rowsPerPage} 
                    onChange={handleRowsPerPageChange} 
                    id="rowsPerPage" 
                    className="w-auto"
                >
                    {[10, 25, 50].map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </Form.Select>


            {/* Display range (center aligned) */}
<div >
            <span>{firstItemIndex}-{lastItemIndex} of {totalRows} items</span>
</div>
            {/* Pagination controls (right aligned) */}

                {/* First Page */}
                <Button 
                    variant="link" 
                    onClick={goToFirstPage} 
                    disabled={currentPage === 0}
                >
                    <ChevronDoubleLeft />
                </Button>

                {/* Previous Page */}
                <Button 
                    variant="link" 
                    onClick={goToPreviousPage} 
                    disabled={currentPage === 0}
                >
                    <ChevronLeft />
                </Button>

                {/* Page number input */}

                    <input
                        type="number"
                        value={currentPage + 1}
                        onChange={handlePageInput}
                        min="1"
                        max={totalPages}
                        className="form-control d-inline w-auto text-center"
                        style={{ width: "50px" }} // Make the input field narrower
                    />
                    <span className="ms-2">of {totalPages}</span>


                {/* Next Page */}
                <Button 
                    variant="link" 
                    onClick={goToNextPage} 
                    disabled={currentPage >= totalPages - 1}
                >
                    <ChevronRight />
                </Button>

                {/* Last Page */}
                <Button 
                    variant="link" 
                    onClick={goToLastPage} 
                    disabled={currentPage >= totalPages - 1}
                >
                    <ChevronDoubleRight />
                </Button>
            </Col>
        </Row>
    );
};

export default PaginationComponent;
