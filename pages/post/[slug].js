import sanityClient from "@sanity/client";
import styles from "../../styles/Post.module.css";
import { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import SanityBlockContent from "@sanity/block-content-to-react";
import { Toolbar } from "../../components/toolbar";
import client from "../../lib/client";
import { Card } from "react-bootstrap";
import groq from "groq";
// import Image from "next/image";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}
export const Post = ({ post }) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (post?.mainImage) {
      const srcString = urlFor(post.mainImage);

      setImageUrl(srcString);
    }
  }, [post]);

  return (
    <div className="mb-2">
      <Toolbar />
      <div className={styles.main}>
        <h1>{post?.title}</h1>

        <div>{<SanityBlockContent blocks={post?.body} />}</div>
        <h4>My implementation:</h4>
        {imageUrl && (
          <img className={styles.mainImage} src={imageUrl} alt="img" />
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  body,
  mainImage,
  "categories": categories[]->title
}`;

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"

  const { slug = "" } = context.params;
  const post = await client.fetch(query, { slug });
  return {
    props: {
      post,
    },
  };
}

export default Post;
