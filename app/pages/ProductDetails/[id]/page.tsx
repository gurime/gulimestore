import Footer from "@/app/components/Footer";
import { getArticle } from "../lib";
import Navbar from "@/app/components/Navbar";
import ImageGallery from "@/app/components/ImageGallery";
import AddToCartBtn from "../../Cart/AddToCart";
import ContentDisplay from "@/app/components/ContentDisplay";
import ProductRatings from "@/app/components/ProductRating";


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
        <div className="product-container">
          <ImageGallery images={images} />
          <div className="product-details">
            <div className="product-info">
              <h1 className="detailproduct-title">{product.title}</h1>
              <div className="product-ratings">
                <div className="rating-stars">
                <ProductRatings productId={articleId}/>
                {/* <LeaveReview articleId={articleId/>}> */}
                </div>
                <span className="rating-count">{product.ratingCount} </span>
              </div>
              <p className="detailproduct-price">${product.price}</p>
              <AddToCartBtn articleId={articleId} product={product} />
              <div className="product-delivery">
                <p>
                  <strong style={{padding:'3rem'}}>Delivery:</strong> Get it by {formattedDate}
                </p>
                <p>
                  <strong style={{padding:'3rem'}}>Pickup:</strong> Free pickup today at <a href="#">Gulime</a>
                </p>
              </div>
            </div>
            <div className="product-details-info">
              <p>
                <strong style={{padding:'3rem'}}>About this item:</strong>
              </p>
              <ul>
                <ContentDisplay
                  content={product.content}
                  content1={product.content1}
                  content2={product.content2}
                  content3={product.content3}
                  content4={product.content4}
                  content5={product.content5}
                  content6={product.content6}
                  content7={product.content7}
                  content8={product.content8}
                  content9={product.content9}
                  content10={product.content10}
                />
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }