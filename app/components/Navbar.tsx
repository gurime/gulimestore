'use client'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Footer from './Footer';
import Image from 'next/image';
import navlogo from '../img/gulime.png'
import axios from 'axios';
import uuid from 'uuid4';
import Link from 'next/link';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { auth, db } from '../Config/firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type SearchResult = {
  title: string;
  coverimage: string;
  price: string;
  id: string;
};

type UserData = {
  id: string;
  first_name: string;
};

export default function Navbar() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'visible';
    }
    
    return () => {
      body.style.overflow = 'visible';
    };
  }, [isOpen]);
;
    

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#000',
    opacity: 0.6,
    display: isOverlayActive ? 'block' : 'none',
    pointerEvents: 'none',
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsSignedIn(true);
          
          try {
            // Fetch user data from Firestore
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
              setUserData(userSnapshot.data() as UserData);
            } else {
              console.log('No user data found');
              setUserData(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData(null);
          }
        } else {
          setIsSignedIn(false);
          setUserData(null);
        }
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, []);


  const toggleFooter = () => {
    setIsFooterVisible(!isFooterVisible);
  };

  const handleSearch = async () => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) {
      setSearchResults([]);
      return;
    }
  
    try {
      const response = await axios.get('/api/search', {
        params: { term: trimmedTerm },
      });
      setSearchResults(response.data.results || []);
      setIsOverlayActive(true);
    } catch (error) {
      setSearchResults([]);
      setIsOverlayActive(false);
    }
  };

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const searchContainer = document.querySelector('.search-results-container');
    const searchInput = document.querySelector('input[type="search"]');

    if (searchContainer && !searchContainer.contains(target) && target !== searchInput) {
      setIsOverlayActive(false);
      setSearchResults([]);
      setSearchTerm('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsOverlayActive(false);
    }
  }, [searchTerm]);
  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsOverlayActive(event.target.value.length > 0);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/pages/Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setIsSignedIn(true);
        setUserData({
          id: user.uid,
          first_name: user.displayName || 'User'
        });
      } else {
        setIsSignedIn(false);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className={`nav ${isOpen ? 'nav-open' : ''}`}>
      <div className='small-nav'>
<div className="burger" onClick={toggleMenu}>
{isOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
</div>
        <Image
          onClick={() => router.push('/')}
          src={navlogo}
          width={140}
          alt="Doctor Care Logo"
        />
        </div>
        <div style={overlayStyle}></div>

        <form style={{ width: '100%', position: 'relative' }} onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Search Gulime"
            aria-label="Search Gulime"
            type="search"
            spellCheck={false}
            dir="auto"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          {isOverlayActive && (
              <div className="search-results-container">
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div key={product.id || uuid()} className="search-result-item">
                      <Link href={`/pages/ProductDetails/${product.id}`}>
                        <div className="product-card">
                          <img className="product-image" src={product.coverimage} alt={product.title} />
                          <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <p className="product-price">${product.price}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No Results Found...</p>
                )}
              </div>
            </div>
       
          )}
        </form>

        <div className={`navlinks ${isOpen ? 'open' : ''}`}>
          <Link href="/" onClick={toggleMenu}>Home</Link>
          <Link href="/pages/Technology" onClick={toggleMenu}>Technology</Link>
          <Link href="/pages/Music" onClick={toggleMenu}>Music</Link>
          <Link href="/pages/Fashion" onClick={toggleMenu}>Fashion</Link>
          <Link href="/pages/Sports" onClick={toggleMenu}>Sports</Link>

          {isSignedIn && userData ? (
            <>
              <Link href="/pages/Account">Account</Link>
              <span className="sm-name">{userData.first_name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href='/pages/Register' className="sm-name">Guest</Link>
              <Link href="/pages/Login">Login</Link>
            </>
          )}

          <Link href='/pages/Cart' className="cart-link">
            <div className="cart-icon-container">
              <ShoppingCart style={{ fontSize: '24px', color: '#fff', padding: '0 0.3rem 0 0' }} />
              <span className="cart-count">{cartCount !== undefined ? cartCount : ''}</span>
            </div>
          </Link>
          <Link href="#" onClick={toggleFooter}>More:</Link>
        </div>
        {isOpen && <div className="overlay" onClick={toggleMenu}></div>}

      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
          {isFooterVisible && <Footer />}
        </div>
      </div>
    </>
  );
}
