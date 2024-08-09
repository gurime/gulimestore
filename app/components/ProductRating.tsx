'use client';
import { collection, addDoc, getDocs, query, where, getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../Config/firebase";
import { Star } from "lucide-react";

interface Rating {
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

interface ProductRatingsProps {
  productId: string;
}

const ProductRatings: React.FC<ProductRatingsProps> = ({ productId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [doctorName, setDoctorName] = useState('Doctor Name');  // Set default name
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      setIsSignedIn(!!user);
      if (user && productId) {
        const db = getFirestore();
        try {
          const ratingsQuery = query(
            collection(db, "ratings"),
            where("productId", "==", productId),
            where('userId', '==', user.uid)
          );
          const ratingsSnapshot = await getDocs(ratingsQuery);
          const productRatings = ratingsSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            productId,
            userId: user.uid,
          })) as Rating[];
          setRatings(productRatings);
    
          const userRatingDoc = productRatings.find((rating) => rating.userId === user.uid);
          setUserRating(userRatingDoc ? userRatingDoc.rating : 0);
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
      }
    });
    return unsubscribe;
  }, [productId]);

  const handleRating = async (rating: number) => {
    if (!isSignedIn) {
      // Handle sign-in prompt
      return;
    }

    const user = auth.currentUser;
    if (user && productId) {
      const db = getFirestore();
      try {
        const userRatingDoc = ratings.find((r) => r.userId === user.uid);
        if (userRatingDoc) {
          await updateDoc(doc(db, "ratings", userRatingDoc.id), {
            rating,
          });
          setRatings(ratings.map(r => r.userId === user.uid ? {...r, rating} : r));
        } else {
          const newRatingDoc = await addDoc(collection(db, "ratings"), {
            productId,
            rating,
            userId: user.uid,
          });
          
          const newRatingDocSnapshot = await getDoc(newRatingDoc);
          
          if (newRatingDocSnapshot.exists()) {
            setRatings((prevRatings) => [
              ...prevRatings,
              {
                id: newRatingDoc.id,
                productId: productId,
                rating: rating,
                userId: user.uid,
              },
            ]);
          } else {
            console.error("Error getting new rating document");
          }
        }
        setUserRating(rating);
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    } else {
      console.error("User not signed in or Product ID is undefined.");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    const user = auth.currentUser;
    if (user && productId) {
      const db = getFirestore();
      try {
        // Save the review to the database
        await addDoc(collection(db, "reviews"), {
          productId,
          rating,
          reviewText,
          reviewerName,
          userId: user.uid,
          createdAt: new Date(),
        });
        
        setSuccessMessage("Review submitted successfully!");
        setShowConfirmation(true);
        // Clear form fields
        setRating(0);
        setReviewText('');
        setReviewerName('');
      } catch (error) {
        console.error("Error submitting review:", error);
        setErrorMessage("There was an error submitting your review. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("You must be signed in to leave a review.");
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length || 0;

  return (
    <>
      <p onClick={openModal} style={{ margin: '5px 16px 3px 0', paddingLeft: '10px', fontWeight: '300', cursor: 'pointer' }}>
        Leave a Review  
      </p>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ background: 'teal' }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ marginBottom: '20px', borderBottom: 'solid 1px', lineHeight: '2' }}>
              Leave a Review  
            </h2>
            

            {showConfirmation ? (
              <div className="confirmation-message">
                <Star size={48} color="white" />
                <h2>Review Sent!</h2>
                <p>Thank you for your review.</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group">
                    <div className="star-rating">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <label key={index}>
                            <input
                              type="radio"
                              name="rating"
                              value={ratingValue}
                              onClick={() => setRating(ratingValue)}
                              style={{ display: 'none' }}
                            />
                            <Star
                              style={{ marginBottom: '1rem' }}
                              className="star"
                              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                              size={20}
                              onMouseEnter={() => setHover(ratingValue)}
                              onMouseLeave={() => setHover(0)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <textarea
                      style={{ marginBottom: '1rem' }}
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      className="form-input"
                      placeholder="Write your review here..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reviewerName" className="form-label">Your Name:</label>
                    <input
                      style={{ marginBottom: '1rem' }}
                      type="text"
                      id="reviewerName"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      required
                      className="form-input"
                      placeholder="Enter your name"
                    />
                  </div>

                  <button type="submit" disabled={isLoading} className="submit-button">
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
                {errorMessage && <p className="message error-message">{errorMessage}</p>}
                {successMessage && <p className="message success-message">{successMessage}</p>}
                <button onClick={closeModal} className="close-button">Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductRatings;
