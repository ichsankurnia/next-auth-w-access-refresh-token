'use client'

import { FC, useState } from 'react';
import { useFetchwithAxios } from '@/lib/fetch/hooks/useFetch';
import UserForm from '../components/UserForm';
import { signOut, useSession } from 'next-auth/react';
import useAxiosAuth from '@/lib/fetch/hooks/useAxiosAuth';
import Confirm from '../components/Confirm';

type Props = {};

const page: FC<Props> = () => {
    const [selectedData, setSelectedData] = useState<any>(null)
    const [showForm, setShowForm] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const axios = useAxiosAuth()

    const { data: session } = useSession()
    const { data: users, isLoading, error, mutate } = useFetchwithAxios('/v1-appdir/user')

    const handleEdit = (data: any) => {
        setSelectedData(data)
        setShowForm(true)
        setIsEdit(true)
    }

    const handleReceiveDataForm = (data: any) => {
        setShowLoader(true)
        if (isEdit) {
            data.updated_by = session?.user.fullname

            axios.patch(`/v1-appdir/user/${selectedData?._id! as string}`, data)
                .then(res => {
                    console.log(res)
                    handleReset()
                }).catch(err => {
                    if (err.response) alert(err.response.data.message)
                    else alert(err.message)
                    setShowLoader(false)
                })
        } else {
            data.created_by = session?.user.fullname

            axios.post(`/v1-appdir/user`, data)
                .then(res => {
                    console.log(res)
                    handleReset()
                }).catch(err => {
                    if (err.response) alert(err.response.data.message)
                    else alert(err.message)
                    setShowLoader(false)
                })
        }
    }

    const handleDeleteData = () => {
        axios.delete(`/v1-appdir/user/${selectedData?._id! as string}`)
            .then(res => {
                console.log(res)
                handleReset()
            }).catch(err => {
                if (err.response) alert(err.response.data.message)
                else alert(err.message)
                setShowLoader(false)
            })
    }

    const handleReset = () => {
        setSelectedData(null)
        setShowForm(false)
        setShowConfirm(false)
        setIsEdit(false)
        setShowLoader(false)
        mutate()
    }

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    // render data
    return (
        <>
            <div className='p-5 flex flex-col h-screen overflow-y-auto'>
                <div className='flex justify-between items-center mb-5'>
                    <h1 className='text-2xl font-semibold'>Users</h1>
                    <button className='btn-primary w-28' onClick={() => setShowForm(true)}>+ New User</button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5'>
                    {users && users.data.length > 0 && users.data.map((item: any) =>
                        <div className="w-full max-w-sm rounded-lg shadow bg-gray-800 border-gray-700" key={item._id}>
                            <div className="flex justify-end px-4 pt-4">
                                <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-400 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                                    <span className="sr-only">Open dropdown</span>
                                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                </button>
                                {/* <!-- Dropdown menu --> */}
                                <div id="dropdown" className="z-10 hidden text-base list-none divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700">
                                    <ul className="py-2" aria-labelledby="dropdownButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white">Edit</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white">Export Data</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white">Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col items-center pb-10">
                                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/vercel.svg" alt={item.username} />
                                <h5 className="mb-1 text-xl font-medium text-white">{item.username}</h5>
                                <span className="text-sm text-gray-400">{item.fullname}</span>
                                <div className="flex mt-4 space-x-3 md:mt-6">
                                    <button className="btn-primary w-20" onClick={() => {
                                        setSelectedData(item)
                                        setShowForm(true)
                                        setIsEdit(true)
                                    }}>
                                        Edit
                                    </button>
                                    <button className="btn-secondary w-20" onClick={() => {
                                        setSelectedData(item)
                                        setShowConfirm(true)
                                    }} >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='mt-auto'>
                    <button className='btn-secondary' onClick={() => signOut()}>Logout</button>
                </div>
            </div>


            {showForm && <UserForm data={selectedData} onSubmit={handleReceiveDataForm} onClose={handleReset} isLoading={showLoader} />}
            {showConfirm && <Confirm onClose={handleReset} onSubmit={handleDeleteData} isLoading={showLoader} />}
        </>
    )
}

export default page;