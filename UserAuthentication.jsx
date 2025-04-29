import Taskbar from '../components/Taskbar';
import Container from 'react-bootstrap/esm/Container';
import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/esm/Fade';
import { useNavigate } from 'react-router-dom';
import SignInModal from './SignInModal';

function UserAuthentication() {
    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitFail, setSubmitFail] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

        if (value.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required` }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const loginUser = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            // const response = await loginUserEndPoint(formValues.username, formValues.password);

            if (!response.ok) {
                console.error('Login error:', response.message);
                setErrors((prev) => ({ ...prev, password: response.message }));
                setSubmitFail(true);
                setTimeout(() => setSubmitFail(false), 1000);
            } else {
                setLoginSuccess(true);
                setLoggedIn(true);
                setUserEmail(formValues.username); // keep or rename based on how you're using this elsewhere
                setErrors({});
                setFormValues({ username: '', password: '' });
                setCookie('loggedIn', true, 1);
                setCookie('userEmail', formValues.username, 1); // adjust cookie name if desired

                setTimeout(() => {
                    setLoginSuccess(false);
                    navigate('/search');
                }, 2000);
            }
        } catch (error) {
            console.error('Login error:', error);
            setSubmitFail(true);
            setTimeout(() => setSubmitFail(false), 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = Object.values(formValues).every(Boolean) && Object.values(errors).every((err) => !err);

    return (
        <>
            {/* <Taskbar /> */}
            <Container fluid className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column align-items-center w-100 justify-content-center" style={{ maxWidth: '500px', minHeight: '100vh' }}>
                    <Form className="w-100 formContainer" onSubmit={loginUser} noValidate>
                        <h2 className="text-center mb-4">Welcome to Trojan Taste</h2>

                        <FloatingLabel controlId="username" label="Username" className="mb-4 w-75 mx-auto">
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                required
                                value={formValues.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel controlId="password" label="Password" className='w-75 mx-auto'>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={formValues.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </FloatingLabel>

                        <div className="d-flex align-items-center justify-content-center mt-3 w-100">
                            <Button
                                type="submit"
                                size="lg"
                                className="mt-2 login-button"
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? 'Logging in' : 'Login'}
                            </Button>
                        </div>
                    </Form>

                    <div className="text-center mt-3">
                        <p>Don't have an account yet? <a href="/register">Register</a></p>
                    </div>

                    <Fade in={submitFail}>
                        <div className="alert alert-danger text-center mt-3 w-100" role="alert">
                            Login failed. Please try again.
                        </div>
                    </Fade>

                    <Fade in={loginSuccess}>
                        <SignInModal show={loginSuccess} onHide={() => setLoginSuccess(false)} />
                    </Fade>
                </div>
            </Container>
        </>
    );
}

export default UserAuthentication;
