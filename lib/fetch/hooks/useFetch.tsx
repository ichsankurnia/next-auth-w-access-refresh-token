import useSWR from 'swr'
import useAxiosAuth from './useAxiosAuth';

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useFetch(url: string) {
    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        data,
        isLoading,
        error,
        mutate
    }
}


export function useFetchwithAxios(url: string) {
    const axiosAuth = useAxiosAuth();
    const fetcher = () => axiosAuth.get(url).then(res => res.data)

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        data,
        isLoading,
        error,
        mutate
    }
}