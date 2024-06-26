import { useState } from "react";
import Loading from "./Loading";
import { Alert, Button, Modal, Form } from "react-bootstrap";
import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router";
import Error from "./Error";
import Spinner from "./Spinner";
import instance from "../utils/axios/instance";

function UploadDeck({ user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [archetypeName, setArchetypeName] = useState("");
  const [file, setFile] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { data: archetypes, loading, error } = useFetchData(`/archetypes`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !archetypeName || !file) {
      alert("All fields are required");
      return;
    }
    const formData = new FormData();

    if (name) formData.append("name", name);
    if (description) formData.append("description", description);

    // Check if archetype exists and get ID
    if (archetypeName) {
      const findArchetype = archetypes.find((archetype) =>
        archetype.name.toLowerCase() === archetypeName.toLowerCase()
          ? true
          : false
      );

      if (!findArchetype) {
        alert("Archetype not found");
        return;
      }
      formData.append("archetypeId", findArchetype.id);
    }
    if (file) formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await instance.post(
        `${process.env.REACT_APP_API_URL}/decks/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate(`/decks/${response.data.data.id}`);
        }, 500);
      }
    } catch (error) {
      setIsError(error.response.status);
    } finally {
      setIsLoading(false);
    }

    handleClose();
  };

  return isSuccess ? (
    <Alert variant="success">Deck uploaded! </Alert>
  ) : isError ? (
    <Error code={isError} />
  ) : (
    <>
      <Button variant="success" onClick={handleShow}>
        Upload Deck
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        animation={false}
      >
        <div className="bg-secondary text-dark">
          <Modal.Header closeButton>
            <Modal.Title>Upload Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!user ? (
              <Error code={401} />
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  {loading && <Loading />}
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form.Label htmlFor="searchInput">
                    Select or Search Archetype
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="searchInput"
                    list="options"
                    name="options"
                    onChange={(e) => setArchetypeName(e.target.value)}
                    required
                  />
                  <datalist id="options">
                    {archetypes.map((archetype) => (
                      <option key={archetype.id} value={archetype.name} />
                    ))}
                  </datalist>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="file-input">
                    Upload Deck Image
                  </Form.Label>
                  <Form.Control
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                )}
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}

export default UploadDeck;
