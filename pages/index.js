import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Toolbar } from "../components/toolbar";
import groq from "groq";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import client from "../lib/client";
import { Grid, Card, Button, Container } from "react-bootstrap";

export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
    if (posts.length) {
      setMappedPosts(
        posts.map((p) => {
          return {
            ...p,
            category: p.categories ? p.categories[0] : "",
          };
        })
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);

  return (
    <div>
      <Toolbar />
      <div className={styles.main}>
        <div className={styles.feed}>
          <Container
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {mappedPosts.length ? (
              mappedPosts.map((p, index) => (
                <Card style={{ width: "18rem", margin: "1rem" }} key={index}>
                  <Card.Body>
                    <Card.Title className="fw-bold">{p.title}</Card.Title>
                    <Card.Text>{p.category || ""}</Card.Text>
                    <Button
                      onClick={() => router.push(`/post/${p.slug.current}`)}
                      variant="outline-primary"
                    >
                      See post
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <>No Posts Yet</>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}
const StyledHeader = styled.h3`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;
const StyledButton = styled(Button)`
  c
  `;

const query = groq`*[_type == "post" && publishedAt < now()]{
  title,
  slug,
  "categories": categories[]->title
} | order(publishedAt desc)`;

export async function getStaticProps() {
  const posts = await client.fetch(query);
  return {
    props: {
      posts,
    },
  };
}
