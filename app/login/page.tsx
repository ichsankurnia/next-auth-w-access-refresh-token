'use client'

import { FC, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

type Props = {};

const page: FC<Props> = () => {
    const router = useRouter()

    const searchParams = useSearchParams();
    const error = searchParams?.get('error');
    const callbackUrl = searchParams?.get('callbackUrl')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const data = await signIn('credentials', {
                // @ts-ignore
                username: e.target['username']?.value,
                // @ts-ignore
                password: e.target['password']?.value,
                redirect: false,
                callbackUrl: callbackUrl || '/'
            })

            console.log("NEXTAUTH LOGIN :", data)
            if (!data?.ok) {
                alert(`${data?.status} ${data?.error}`)
            } else {
                router.replace(callbackUrl || '/')
            }
        } catch (error) {
            console.log(error)
            alert(`${error}`)
        }
    }

    return (
        <>
            <div className='flex h-screen justify-center items-center p-5'>
                <div className='w-full lg:max-w-[500px] rounded-2xl border p-5 flex flex-col items-center'>
                    <h2 className='text-2xl font-medium'>Welcome Back!</h2>
                    <p>login to your account</p>
                    <form onSubmit={handleSubmit} className='space-y-4 w-full'>
                        <div className='flex flex-col'>
                            <label htmlFor='username'>Username</label>
                            <input type='text' id='username' name='username' className='input-login' required />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' className='input-login' required />
                        </div>
                        <div className='flex justify-end'>
                            <Link href=''>Forgot password?</Link>
                        </div>
                        <button className='btn-primary w-full py-3'>Login</button>
                    </form>
                    <div className='flex justify-center mt-5'>
                        <span>New user? <Link href='/'>Create an acoount</Link></span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default page;