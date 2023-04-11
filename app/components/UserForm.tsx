import React, { ChangeEvent, MouseEvent } from 'react';
import Modal from './Modal';
import { useFetchwithAxios } from '@/lib/fetch/hooks/useFetch';

type Props = {
    data?: any
    onClose: (e: MouseEvent<HTMLElement>) => any
    onSubmit: (payload: any) => any
    isLoading?: boolean
};

const UserForm: React.FC<Props> = ({ onSubmit, onClose, data }) => {
    const { data: USER_ROLE_LIST, isLoading, error } = useFetchwithAxios('/v1-appdir/role')

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { fullname, username, password, role_id, phone_number, email } = e.target

        const payload = {
            fullname: fullname.value,
            username: username?.value,
            password: password?.value,
            role_id: role_id.value,
            phone_number: phone_number.value,
            email: email.value,
        }

        if (data) {
            delete payload.password
            delete payload.username
        }

        onSubmit(payload)
    }

    return (
        <>
            <Modal onClose={onClose}>
                <div className='px-5 py-2' onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center text-lg md:text-2xl border-b border-gray-500 p-5 2xl:p-8">
                        <h2 className="font-semibold">{data ? 'Update User' : 'New User'}</h2>
                        <i className="fa-solid fa-xmark opa-anim" onClick={onClose}></i>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-6 md:p-10 2xl:p-12'>
                            <div>
                                <label htmlFor='fullname' className='label-form'>Fullname</label>
                                <input id="fullname" name='fullname' className="input-form" placeholder='Enter your name' defaultValue={data?.fullname}
                                />
                            </div>
                            {!data &&
                                <div>
                                    <label htmlFor='username' className='label-form'>Username</label>
                                    <input id="username" name='username' className="input-form" placeholder='Enter your username' defaultValue={data?.username}
                                    />
                                </div>
                            }
                            <div>
                                <label htmlFor='role' className='label-form'>Role</label>
                                <select id='role' name='role_id' className='input-form py-2' defaultValue={data?.role_id} >
                                    <option className='bg-black cursor-pointer' value=''>- Select role -</option>
                                    {USER_ROLE_LIST?.data && USER_ROLE_LIST?.data?.map((item: any, key: number) =>
                                        <option className='bg-black cursor-pointer' key={key} value={item._id}>{item.role_name}</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label htmlFor='phone' className='label-form'>Phone</label>
                                <input id="phone" name='phone_number' className="input-form" placeholder='Enter your phone' defaultValue={data?.phone_number}
                                />
                            </div>
                            <div>
                                <label htmlFor='email' className='label-form'>Email</label>
                                <input id="email" type='email' name='email' className="input-form" placeholder='Enter your email' defaultValue={data?.email}
                                />
                            </div>
                            {!data &&
                                <div>
                                    <label htmlFor='password' className='label-form'>Password</label>
                                    <input id="password" type="password" name='password' className="input-form" placeholder='Type your password here' defaultValue={data?.password}
                                    />
                                </div>
                            }

                        </div>
                        <div className="flex items-center space-x-4 p-5 2xl:p-8 border-t border-gray-500">
                            {/* <button type="submit" className="btn-primary w-28">Submit</button> */}
                            <button disabled={isLoading} type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 inline-flex items-center">
                                {isLoading &&
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                }
                                {isLoading ? 'Loading...' : 'Submit'}
                            </button>
                            <button type="reset" className="btn-secondary w-28" onClick={onClose} >Cancel</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default UserForm;