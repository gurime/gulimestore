import { Metadata } from "next";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SkeletonTheme } from "react-loading-skeleton";

export const metadata: Metadata = {
  title: 'Gulime - Your One-Stop Shop for All Your Needs',
  description: 'Explore Gulime, your premier ecommerce destination for a vast array of products, including cars & Trucks. Discover great deals, fast shipping, and exceptional customer service. From everyday essentials to luxury items, Gulime has got you covered.',
  keywords: 'ecommerce, online shopping, cars, trucks, products, deals, fast shipping, customer service, shopping platform'
  }
export default function Home() {
return (
<>
<Navbar/>
{/* <SkeletonTheme baseColor="grey" highlightColor="#e6e6e6"> */}
<Homepage/>
{/* </SkeletonTheme> */}
<Footer/>
</>
);
}
