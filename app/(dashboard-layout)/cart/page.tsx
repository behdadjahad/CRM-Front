import React from 'react'
import CartContainer from '@/components/cart/cart-container'
import Title from '@/components/shared/title'
import Breadcrumb from '@/components/shared/breadcrumb'

export default function Cart() {
    return (
        <main className="flex flex-col">
            <div>
                
            <Title label="سبد خرید" />
            <Breadcrumb
                list={[
                    {
                        label: "داشبورد",
                        link: "/",
                    },
                    {
                        label: "سبد خرید",
                        link: "/cart",
                    },
                ]}
            />
            </div>
            <CartContainer />
        </main>
    )
}
