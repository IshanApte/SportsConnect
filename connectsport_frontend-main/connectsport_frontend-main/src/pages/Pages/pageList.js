import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Modal, Card } from "react-bootstrap";
import CreatePage from "./createPage"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../Components/layout/navbar"; // Ensure this path is correct
import SearchComponent from "../../Components/common/searchComponent";
import { useAuth } from "../../services/useAuth";
import styles from "../../Styles/Pages/page.css"; // Ensure the path is correctly configured

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/pages`);
        setPages(result.data);
      } catch (error) {
        console.error("There was an error fetching the pages:", error);
      }
    };

    fetchPages();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className={`container-fluid ${styles.containerFluid} p-0`}>
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput}
      />
      {searchInput && <SearchComponent />}
      <div className="row">
        <div className="col-12">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Explore Pages</h3>
                <Button variant="outline-primary" onClick={handleShowModal}>
                  Create Page
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {pages.map((page) => (
          <div key={page._id} className="col-md-6 col-lg-4 mb-3">
             <Card className={`h-100 shadow text-center ${styles.semiTransparentCard}`}>
              <Card.Body>
                <Card.Title>
                  <Link to={`/pages/${page._id}`} className="stretched-link">
                    {page.title || "Untitled Page"}
                  </Link>
                </Card.Title>
                <Card.Text>{page.description}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreatePage onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PagesList;
