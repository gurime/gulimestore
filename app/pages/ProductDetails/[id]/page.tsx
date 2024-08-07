import Footer from "@/app/components/Footer";
import { getArticle } from "../lib";
import Navbar from "@/app/components/Navbar";


export async function generateMetadata({ params }: { params: { id: string } }): Promise<{ title: string }> {
    const articleId: string = params.id;
  
    try {
      const articleDetails: any | null = await getArticle(articleId);
  
      if (articleDetails) {
        return {
          title: `Gulime | ${articleDetails.title || 'Page Not Found'}`,
        };
      } else {
        return {
          title: 'Gulime | Page Not Found',
        };
      }
    } catch (error) {
      return {
        title: 'Gulime | Page Not Found',
      };
    }
  }


  export default async function DetailsPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
    const articleId: string = params.id;
  
    // Fetch article details
    const post: any | null = await getArticle(articleId);
  
    if (!post) {
      return <div>Product not found</div>;
    }
  
    const currentDate = new Date();
    const twoDaysAhead = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
    const formattedDate = twoDaysAhead.toLocaleDateString();
  
    const images = [post.coverimage, post.imgshowcase, post.imgshowcase1, post.imgshowcase2, post.imgshowcase3, post.imgshowcase4, post.imgshowcase5, post.imgshowcase6, post.imgshowcase7].filter(Boolean);
  
    // Convert the `timestamp` object to a simple value
    const product = {
      ...post,
      timestamp: post.timestamp ? post.timestamp.seconds : null,
    };
  
    return (
      <>
        <Navbar />
     
<img src={product.coverimage} alt={product.coverimage} />
<h1>{product.title}</h1>
<p>{product.price}</p>
        <Footer />
      </>
    );
  }