import useSWR from 'swr'
import http from './http.service';
import { HttpResponse } from '@/types/http';
import { Company } from '@/types/company.type';

interface UseCompanyParams {
    path?: string; // Optional path to append to the base URL
    shouldFetch?: boolean; // Whether to fetch the data immediately
    includeBaseParams?: boolean; // Whether to include base parameters
    [key: string]: any; // Additional query parameters
}

export const useCompany = <T = any>({ path = "", shouldFetch = true, includeBaseParams = true, ...params }: UseCompanyParams) => {
    const baseParams = {}
    const mergedParams = { ...baseParams, ...params };
    const queryParams = new URLSearchParams(
        includeBaseParams ?
            Object.entries(mergedParams)
                .filter(([_, value]) => value !== null && value !== undefined) // Remove null or undefined values
                .map(([key, value]) => [key, String(value)]) // Convert all values to strings
            : params
    ).toString();
    const url = `/company${path ? `/${path}` : ""}${queryParams ? `?${queryParams}` : ""}`
    const { data, error, mutate, isLoading, isValidating } = useSWR(
        url,
        async (url) => {
            const response = await http.get(url);
            if (response) {
                if (Array.isArray(response.data)) {
                    return response.data.map(serializeCompany) as T;
                } else if (typeof response.data === 'object' && response.data !== null) {
                    return serializeCompany(response.data) as T;
                }
                return response as T;
            }
        },
        {
            revalidateOnMount: shouldFetch,
            revalidateIfStale: shouldFetch,
            revalidateOnReconnect: shouldFetch,
            revalidateOnFocus: false,
        }
    )
    return {
        data,
        error,
        mutate,
        isLoading,
        isValidating,
    };
};

function serializeCompany(company: any): Company {
    return {
        id: company.uid,
        name: company.name,
    };
}

const ENDPOINT = '/company';

const getCompanyByName = async (companyIdentifier: string): Promise<Company | null> => {
    const res = await http.get(`${ENDPOINT}/public/${companyIdentifier}`);
    console.log({ res });
    if (res && res.data) {
        return serializeCompany(res.data);
    }
    return null;
}

export const companyService = {
    getCompanyByName,
};