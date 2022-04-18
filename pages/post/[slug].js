import sanityClient from "@sanity/client";
import styles from "../../styles/Post.module.css";
import { useState, useEffect } from "react";
import { ImageUrlBuilder } from "@sanity/image-url";
import SanityBlockContent from "@sanity/block-content-to-react";
import { Toolbar } from "../../components/toolbar";

export const client = sanityClient({
  projectId: "f6z2kolu", // you can find this in sanity.json
  dataset: "production", // or the name you chose in step 1
  useCdn: true, // `false` if you want to ensure fresh data
});

export const Post = ({ post }) => {
  //   console.log(title, body, image);
  const [imageUrl, setImageUrl] = useState("");
  //   useEffect(() => {
  //     const imgBuilder = ImageUrlBuilder({
  //       projectId: "f6z2kolu",
  //       dataset: "production",
  //     });
  //     setImageUrl(imgBuilder.image(image));
  //   }, [post.image]);

  return (
    <div>
      <Toolbar />
      <div className={styles.main}>
        <h1>{post?.title}</h1>
        {/* {imageUrl && <img className={styles.mainImage} src={imageUrl} />} */}
        <div>{<SanityBlockContent blocks={post?.body} />}</div>
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

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(
    `
      *[_type == "post" && slug.current == $slug][0]
    `,
    { slug }
  );
  return {
    props: {
      post,
    },
  };
}

export default Post;
