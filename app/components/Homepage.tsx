'use client'
import React, { useState, useEffect } from 'react'
import { db } from '../Config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Article {
  id: string;
  title: string;
  content: string;
  price: number;
  coverimage: string; 
  category: string;
  // Add other fields as necessary
}

async function getArticles(): Promise<Article[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Article));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

const Homepage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [useArticle, setUseArticle] = useState<Article[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const articles = await getArticles();
        setUseArticle(articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Article) => {
    // Implement your add to cart logic here
    console.log(`Added ${product.title} to cart`);
  };

  return (
    <div className='hero-grid'>
      {loading ? (
        <>
          <div className="main-content">
            <div className="mainflex">
              <div style={{ display: 'grid' }}>
                <Skeleton height={30} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
              <Skeleton height={200} width={300} />
            </div>
          </div>
          <div className="first-left-content">
            <Skeleton height={30} />
            <Skeleton height={200} width={300} />
            <Skeleton height={30} />
            <Skeleton height={40} />
          </div>
          <div className="second-left-content">
            <Skeleton height={30} />
            <Skeleton height={200} width={300} />
            <Skeleton height={30} />
            <Skeleton height={40} />
          </div>
        </>
      ) : (
        useArticle
          .filter((post) => ['d4cY1CZ4eQnX26ipigAE', 'jTY4uUE9E5FYBM0rVBXr', 'kVO4Bvo3xiG8Plw9rx2n', 'XhvB1SPHwuwZlHiKZCyw'].includes(post.id))
          .map((post) => (
            <React.Fragment key={post.id}>
              {post.id === 'd4cY1CZ4eQnX26ipigAE' && (
                <div className="main-content">
                  <div className="mainflex">
                    <div style={{ display: 'grid' }}>
                      <h2>{post.category}</h2>
                      <span style={{ fontSize: '17px', lineHeight: '40px' }}>{post.title}</span>
                      <span className='dashprice' style={{ lineHeight: '50px', fontSize: '24px', color: '#464646' }}>${post.price}</span>
                    </div>
                    <Link href={`/pages/ProductDetails/${post.id}`}>
                      <img src={post.coverimage} className="main-content-img" alt={post.title} />
                    </Link>
                  </div>
                </div>
              )}
              {['jTY4uUE9E5FYBM0rVBXr', 'XhvB1SPHwuwZlHiKZCyw'].includes(post.id) && (
                <div className="first-left-content">
                  <h2>{post.category}</h2>
                  <div className="content-wrapper">
                    <Link href={`/pages/ProductDetails/${post.id}`}>
                      <img src={post.coverimage} alt={post.title} />
                    </Link>
                    <span style={{ fontSize: '20px', lineHeight: '40px' }}>{post.title}</span>
                    <div className='dashprice' style={{ lineHeight: '50px', fontSize: '24px', color: '#464646' }}>${post.price}</div>
                    <div>
                      <button onClick={() => handleAddToCart(post)}>Add to cart</button>
                    </div>
                  </div>
                </div>
              )}
              {post.id === 'kVO4Bvo3xiG8Plw9rx2n' && (
                <div className="second-left-content">
                  <h2>{post.category}</h2>
                  <div>
                    <Link href={`/pagesProduct/Details/${post.id}`}>
                      <img src={post.coverimage} alt={post.title} />
                    </Link>
                  </div>
                  <span style={{ fontSize: '20px', lineHeight: '40px' }}>{post.title}</span>
                  <div className='dashprice' style={{ lineHeight: '50px', fontSize: '24px', color: '#464646' }}>${post.price}</div>
                  <div>
                    <button onClick={() => handleAddToCart(post)}>Add to cart</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
      )}
    </div>
  );
};

export default Homepage;