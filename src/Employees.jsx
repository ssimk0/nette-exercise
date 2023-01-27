import {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EmployeeForm from './EmployeeForm';
import axios from './axios';
import {api} from './axios'

const Employees = () => {
    const columns = [
        {
            name: '#',
            value: (row) => row.id,
        },
        {
            name: 'Meno',
            value: (row) => row.name,
        },
        {
            name: 'Email',
            value: (row) => row.email,
        },
        {
            name: 'Vek',
            value: (row) => row.age,
        },
        {
            name: 'Pohlavie',
            value: (row) => row.sex,
        }
    ]
    const [tableData, setTableData] = useState();
    const [toRemove, setToRemove] = useState(null);
    const fetchTableData = async () => {
        const data = await api.list();
        console.log(data)
        setTableData(data)
    }
    useEffect(() => {
        fetchTableData()
    }, [])

    const createEmployee = async (data) => {
        await api.create(data);
        await fetchTableData()
    }

    const editEmployee = async (data) => {
        if (!data.id) return
        await api.edit(data)
        await fetchTableData()
    }

    const removeItem = async () => {
        if (!toRemove.id) return
        await api.remove(toRemove.id)
        await fetchTableData()

        setToRemove(null)
    }

    return tableData ? (
        <div className="container">
            <div className="my-5">
                <div className="row">
                    <div className="col col-md-6">
                        <h3>Employees</h3>
                    </div>
                    <div className="col col-md-6 text-end">
                        <EmployeeForm onSave={createEmployee}>
                            <>
                                Pridat zamestnanca <i
                                className="bi bi-plus-lg fw-bold"></i>
                            </>
                        </EmployeeForm>
                    </div>
                </div>
            </div>
            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    {columns.map((column) => {
                        return (
                            <th key={column.name}>{column.name}</th>
                        )
                    })}
                    <th>Akcie</th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row) => (<tr key={row.id}>
                        {columns.map((column) => (
                            <th key={`${row.id}-${column.name}`}>
                                {column.value(row)}
                            </th>)
                        )}
                        <th className="text-end">
                            <EmployeeForm onSave={editEmployee} data={row}>
                                <>
                                    Upravit <i
                                    className="bi bi-pencil fw-bold"></i>
                                </>
                            </EmployeeForm>
                            <Button variant="outline-danger" className="ms-3" onClick={() => setToRemove(row)}><>Vymazat <i
                                className="bi bi-trash"></i></></Button>
                        </th>
                    </tr>)
                )}
                </tbody>
            </Table>

            { toRemove !== null && (<Modal show={true} onHide={() => setToRemove(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Potvrdenie vymazania</Modal.Title>
                </Modal.Header>
                <Modal.Body>Ste si isty ze chcete vymazat zamestnanca {toRemove !== null ? toRemove.name : ''} ({toRemove !== null ? toRemove.email : ''})</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setToRemove(null)}>
                        Zavriet
                    </Button>
                    <Button variant="primary" onClick={removeItem}>
                        Vymazat
                    </Button>
                </Modal.Footer>
            </Modal>)
            }
        </div>
    ) : (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <Spinner animation="grow" variant="primary"/>
        </div>)
}

export default Employees