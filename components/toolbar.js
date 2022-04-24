import { useRouter } from "next/router";
import { Nav, Navbar, Container } from "react-bootstrap";
import styled from "styled-components";
import styles from "../styles/Toolbar.module.css";

export const Toolbar = () => {
  const router = useRouter();

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Algo Blog
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={() => router.push("/")}>Home</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
