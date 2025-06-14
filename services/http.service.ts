import { HttpResponse } from '@/types/http'
import Axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const axios = Axios.create({
    withCredentials: false
})

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
})

const http = {
    get(endpoint: string, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'GET', null, params)
    },
    post(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'POST', data, params)
    },
    put(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'PUT', data, params)
    },
    patch(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'PATCH', data, params)
    },
    delete(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'DELETE', data, params)
    }
}

const handleError = (response: HttpResponse) => {
    if (!response.meta || !response.meta.code) {
        toast({
            title: 'Error',
            description: response.meta?.message || 'An unexpected error occurred.',
            variant: 'destructive'
        })
        return
    }
    switch (response.meta.code) {
        case 400:
            toast({
                title: 'Bad Request',
                description: response.meta.message || 'The request was invalid.',
                variant: 'destructive'
            })
            break
        case 401:
            toast({
                title: 'Unauthorized',
                description: response.meta.message || 'You are not authorized to access this resource.',
                variant: 'destructive'
            })
            break
        case 403:
            toast({
                title: 'Forbidden',
                description: response.meta.message || 'You do not have permission to perform this action.',
                variant: 'destructive'
            })
            break
        case 404:
            toast({
                title: 'Not Found',
                description: response.meta.message || 'The requested resource could not be found.',
                variant: 'destructive'
            })
            break
        case 500:
            toast({
                title: 'Server Error',
                description: response.meta.message || 'An internal server error occurred.',
                variant: 'destructive'
            })
            break
        default:
            toast({
                title: 'Error',
                description: response.meta.message || 'An unexpected error occurred.',
                variant: 'destructive'
            })
            break
    }
}

async function ajax(endpoint: string, method = 'GET', data: unknown = null, params: Record<string, unknown> = {}) {
    try {
        const { noError, ...cleanParams } = params
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: cleanParams,
        })

        return res.data
    } catch (err: unknown) {
        if (Axios.isAxiosError(err)) {
            const axiosError = err as AxiosError
            const errorResponse = axiosError.response?.data as HttpResponse
            if (errorResponse) {
                if (!params.noError)
                    handleError(errorResponse)
            } else {
                toast({
                    title: 'Error',
                    description: axiosError.message || 'An unexpected error occurred',
                    variant: 'destructive'
                })
            }
        }
    }
}

export default http
