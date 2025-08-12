import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import QuizPage from "@/app/quiz/page";
import TrustedPartnerSection from "@/components/TrustedPartnerSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import RecommendedProducts from "@/components/RecommendedProducts";
import BlogSection from '@/components/blog/BlogSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'


export default function HomePage() {
  return (
      <main>
        <Navbar />
        <Hero />
          <QuizPage />
          <TrustedPartnerSection />
          <ReviewsCarousel />
          <RecommendedProducts />
          <BlogSection />
          <ContactSection id="contacts"/>
          <Footer />
      </main>
  )
}
