import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from "react-hook-form";


const EmployeeForm = ({onSave, data = {}, children}) => {
    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: data,
    });

    const handleClose = () => setShow(false);

    const onSubmit = async (formData) => {
        setDisabled(true);
        await onSave({
            ...data,
            ...formData,
        });
        setDisabled(false);
        handleClose();
    }
    const handleShow = () => {
        reset({...data})
        setShow(true);
    }

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow}>
                {children}
            </Button>

            {show && <Modal show={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Pridat Zamestnanca</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="employee-form" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Meno</Form.Label>
                            <Form.Control type="text" placeholder="Meno" {...register("name", { required: true })}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email"  {...register("email", { required: true })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Vek</Form.Label>
                            <Form.Control type="number" placeholder="Vek"  {...register("age", { required: true, min: 18, max: 120 })} />
                            {errors.age && (<Form.Control.Feedback type="invalid">
                                errors.age.message
                            </Form.Control.Feedback>) }
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Pohlavie</Form.Label>
                            <Form.Select aria-label="Pohlavie" {...register("sex", { required: true })}>
                                <option></option>
                                <option value="zena">Zena</option>
                                <option value="muz">Muz</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={disabled} onClick={handleClose}>
                        Zavriet
                    </Button>
                    <Button variant="primary" disabled={disabled} type="submit" form="employee-form">
                        Ulozit
                    </Button>
                </Modal.Footer>
            </Modal>
            }
        </>
    );
}

export default EmployeeForm