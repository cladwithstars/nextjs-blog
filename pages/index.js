import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Toolbar } from "../components/toolbar";
import groq from "groq";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "f6z2kolu", // you can find this in sanity.json
  dataset: "production", // or the name you chose in step 1
  useCdn: true, // `false` if you want to ensure fresh data
});

export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
    if (posts.length) {
      // const imgBuilder = imageUrlBuilder({
      //   projectId: "mjoyrhci",
      //   dataset: "production",
      // });

      setMappedPosts(
        posts.map((p) => {
          return {
            ...p,
            // mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
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
        <h3>Recent Posts:</h3>

        <div className={styles.feed}>
          {mappedPosts.length ? (
            mappedPosts.map((p, index) => (
              <div
                onClick={() => router.push(`/post/${p.slug.current}`)}
                key={index}
                className={styles.post}
              >
                <h3 style={{ cursor: "pointer" }}>{p.title}</h3>
                {/* <img className={styles.mainImage} src={p.mainImage} /> */}
              </div>
            ))
          ) : (
            <>No Posts Yet</>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await client.fetch(groq`
    *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
  `);
  return {
    props: {
      posts,
    },
  };
}
