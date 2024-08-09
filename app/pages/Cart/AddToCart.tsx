'use client'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Article {
  userId: string;
  id: string;
  title: string;
  price: number;
  coverimage: string;
  savedForLater: boolean;
  quantity?: number;
}

export default function AddToCartBtn({ articleId, product }: { articleId: string; product: Article }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddToCart = async (product: Article) => {
    if (!currentUser) {
      router.push('/pages/Login');
      return;
    }

    const db = getFirestore();
    const userCartRef = doc(db, 'carts', currentUser.uid);

    try {
      const cartDoc = await getDoc(userCartRef);

      if (cartDoc.exists()) {
        // Cart exists, update it
        await updateDoc(userCartRef, {
          items: arrayUnion({
            ...product,
            quantity: 1,
          }),
        });
      } else {
        // Cart doesn't exist, create a new one
        await setDoc(userCartRef, {
          items: [{
            ...product,
            quantity: 1,
          }],
        });
      }

      console.log('Product added to cart successfully');

      // Optionally, you can add some user feedback here, like a toast notification
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // Handle the error, maybe show an error message to the user
    }
  };
 
  return (
    <>
      <button className='add-to-cart-btn' onClick={() => handleAddToCart(product)}>Add to cart</button>
    </>
  );
}