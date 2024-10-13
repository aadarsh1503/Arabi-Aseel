import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hero from './components/Hero/Hero'
import BlogSection from './components/BlogSection/BlogSection'
import PopularCategories from './components/PopularCategory/PopularCategory'
import ServiceSection from './components/ServiceSection/ServiceSection'
import PromotionSection from './components/PromotionSection/PromotionSection'
import RootLayout from './components/RootLayout/RootLayout'
import SpecialsMenu from './components/SpecialMenu/SpecialMenu'
import OpeningHours from './components/OpeningHours/OpeningHours'
import ChefsSection from './components/ChefSection/ChefSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <RootLayout >
    <div>
     <Hero />
     <PopularCategories />
     <ServiceSection />
     <PromotionSection />
     <SpecialsMenu />
     <OpeningHours />
     <ChefsSection />
     <BlogSection />
    </div>
    </RootLayout>
  )
}

export default App
