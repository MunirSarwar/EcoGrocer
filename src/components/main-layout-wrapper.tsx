
'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')
    const isLogin = pathname.startsWith('/login')
    const isSeller = pathname.startsWith('/seller')
    const isDelivery = pathname.startsWith('/delivery')

    // Don't show the main header/footer on admin, seller, delivery or login pages
    if (isAdmin || isLogin || isSeller || isDelivery) {
        return <>{children}</>
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}
