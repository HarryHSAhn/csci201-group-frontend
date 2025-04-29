import Modal from 'react-bootstrap/Modal';

function SignInModal({show, onHide}) {



    return(
    <>

      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>You have signed in successfully.</Modal.Title>
        </Modal.Header>

      </Modal>
    </>
    )
}

export default SignInModal;