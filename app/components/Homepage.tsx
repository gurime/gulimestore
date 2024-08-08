'use client'
import React, { useState, useEffect } from 'react'
import { db } from '../Config/firebase';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const handleAddToCart = async (article: Article) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
  
      if (!currentUser) {
        console.log('User is not logged in');
        // You might want to redirect to a login page or show a message
        // For example: router.push('/login');
        return;
      }
  
      const cartCollectionRef = collection(db, 'carts', currentUser.uid, 'items');
      
      // Check if the item already exists in the user's cart
      const q = query(cartCollectionRef, where("id", "==", article.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Item exists, update its quantity
        const existingItemDoc = querySnapshot.docs[0];
        const existingItemData = existingItemDoc.data();
        await updateDoc(doc(cartCollectionRef, existingItemDoc.id), {
          quantity: (existingItemData.quantity || 0) + 1
        });
      } else {
        // Item doesn't exist, add new document
        const newItemRef = doc(cartCollectionRef); // This generates a new document ID
        await setDoc(newItemRef, {
          coverimage: article.coverimage,
          id: article.id,
          price: article.price.toString(), // Convert to string to match your DB structure
          quantity: 1,
          title: article.title
        });
      }
  
      console.log('Product added to cart successfully');
      router.push('/pages/Cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
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
          .filter((product) => ['d4cY1CZ4eQnX26ipigAE', 'jTY4uUE9E5FYBM0rVBXr'].includes(product.id))
          .map((product) => (
            <React.Fragment key={product.id}>
              {product.id === 'd4cY1CZ4eQnX26ipigAE' && (
                <div className="main-content">
                  <div className="mainflex">
                    <div style={{ display: 'grid' }}>
                      <span className='dashcategory'>{product.category}</span>
                      <span className='dashprice' >${product.price}</span>
                    </div>
                    <Link href={`/pages/ProductDetails/${product.id}`}>
                      <img src={product.coverimage} className="main-content-img" alt={product.title} />
                    </Link>
                    <span style={{ fontSize: '17px', lineHeight: '40px' }}>{product.title}</span>
                  </div>
                </div>
              )}
              {['jTY4uUE9E5FYBM0rVBXr'].includes(product.id) && (
                <div className="first-left-content">
                  <div className="content-wrapper">
                    <span className='dashcategory'>{product.category}</span>
                    <Link href={`/pages/ProductDetails/${product.id}`}>
                      <img src={product.coverimage} alt={product.title} />
                    </Link>
                    <span style={{ fontSize: '20px', lineHeight: '40px' }}>{product.title}</span>
                    <div className='dashprice' >${product.price}</div>
                    <div>
                      <button onClick={() => handleAddToCart(product)}>Add to cart</button>
                    </div>
                  </div>
                </div>
              )}
              {['jTY4uUE9E5FYBM0rVBXr'].includes(product.id) && (
                <div className="second-left-content">
                  <div className="content-wrapper">
                    <span className='dashcategory'>{product.category}</span>
                    <Link href={`/pages/ProductDetails/${product.id}`}>
                      <img src={product.coverimage} alt={product.title} />
                    </Link>
                    <span style={{ fontSize: '20px', lineHeight: '40px' }}>{product.title}</span>
                    <div className='dashprice' >${product.price}</div>
                    <div>
                      <button onClick={() => handleAddToCart(product)}>Add to cart</button>
                    </div>
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