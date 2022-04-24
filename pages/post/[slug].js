import sanityClient from "@sanity/client";
import styles from "../../styles/Post.module.css";
import { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import SanityBlockContent from "@sanity/block-content-to-react";
import { Toolbar } from "../../components/toolbar";
import client from "../../lib/client";
import { Card } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import groq from "groq";
// import Image from "next/image";
// import { style } from "react-syntax-highlighter/dist/esm/styles/prism";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}
const serializers = {
  types: {
    code: (props) => (
      <SyntaxHighlighter
        useInlineStyles={false}
        language={props.node.language}
        // style={docco}
      >
        {props.node.code}
      </SyntaxHighlighter>
    ),
  },
};
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
        <h1 className="mb-4">{post?.title}</h1>

        <div>
          {<SanityBlockContent serializers={serializers} blocks={post?.body} />}
        </div>

        {imageUrl && (
          <img className={styles.mainImage} src={imageUrl} alt="img alt" />
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
