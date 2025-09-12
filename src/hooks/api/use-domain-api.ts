import { useCallback } from 'react'
import { useApi } from './use-api'
import { dashboardApi, userApi, domainApi, dnsApi } from '@/lib/api/domain-api'
import type { 
  User, 
  Domain, 
  DnsRecord, 
  UserFormData, 
  DomainFormData, 
  DnsRecordFormData,
  QueryParams,
  DashboardStats
} from '@/types/domain'
import type { PaginationData } from '@/types/api'

// 仪表板钩子
export function useDashboard() {
  const { data: stats, loading, error, execute } = useApi<DashboardStats>()

  const getStats = useCallback(() => {
    execute(dashboardApi.getStats)
  }, [execute])

  return {
    stats,
    loading,
    error,
    getStats
  }
}

// 用户管理钩子
export function useUsers() {
  const { data: users, loading, error, execute } = useApi<PaginationData<User>>()
  const { loading: actionLoading, execute: executeAction } = useApi()

  const getUsers = useCallback((params: QueryParams) => {
    execute(() => userApi.getList(params))
  }, [execute])

  const createUser = useCallback(async (data: UserFormData) => {
    return executeAction(() => userApi.create(data))
  }, [executeAction])

  const updateUser = useCallback(async (id: number, data: Partial<UserFormData>) => {
    return executeAction(() => userApi.update(id, data))
  }, [executeAction])

  const deleteUser = useCallback(async (id: number) => {
    return executeAction(() => userApi.delete(id))
  }, [executeAction])

  const batchDeleteUsers = useCallback(async (ids: number[]) => {
    return executeAction(() => userApi.batchDelete(ids))
  }, [executeAction])

  return {
    users,
    loading,
    error,
    actionLoading,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    batchDeleteUsers
  }
}

// 域名管理钩子
export function useDomains() {
  const { data: domains, loading, error, execute } = useApi<PaginationData<Domain>>()
  const { loading: actionLoading, execute: executeAction } = useApi()

  const getDomains = useCallback((params: QueryParams) => {
    execute(() => domainApi.getList(params))
  }, [execute])

  const createDomain = useCallback(async (data: DomainFormData) => {
    return executeAction(() => domainApi.create(data))
  }, [executeAction])

  const updateDomain = useCallback(async (id: number, data: Partial<DomainFormData>) => {
    return executeAction(() => domainApi.update(id, data))
  }, [executeAction])

  const deleteDomain = useCallback(async (id: number) => {
    return executeAction(() => domainApi.delete(id))
  }, [executeAction])

  const batchDeleteDomains = useCallback(async (ids: number[]) => {
    return executeAction(() => domainApi.batchDelete(ids))
  }, [executeAction])

  const renewDomain = useCallback(async (id: number, years: number) => {
    return executeAction(() => domainApi.renew(id, years))
  }, [executeAction])

  return {
    domains,
    loading,
    error,
    actionLoading,
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
    batchDeleteDomains,
    renewDomain
  }
}

// DNS管理钩子
export function useDnsRecords() {
  const { data: dnsRecords, loading, error, execute } = useApi<PaginationData<DnsRecord>>()
  const { loading: actionLoading, execute: executeAction } = useApi()

  const getDnsRecords = useCallback((params: QueryParams & { domainId?: number }) => {
    execute(() => dnsApi.getList(params))
  }, [execute])

  const createDnsRecord = useCallback(async (data: DnsRecordFormData) => {
    return executeAction(() => dnsApi.create(data))
  }, [executeAction])

  const updateDnsRecord = useCallback(async (id: number, data: Partial<DnsRecordFormData>) => {
    return executeAction(() => dnsApi.update(id, data))
  }, [executeAction])

  const deleteDnsRecord = useCallback(async (id: number) => {
    return executeAction(() => dnsApi.delete(id))
  }, [executeAction])

  const batchDeleteDnsRecords = useCallback(async (ids: number[]) => {
    return executeAction(() => dnsApi.batchDelete(ids))
  }, [executeAction])

  return {
    dnsRecords,
    loading,
    error,
    actionLoading,
    getDnsRecords,
    createDnsRecord,
    updateDnsRecord,
    deleteDnsRecord,
    batchDeleteDnsRecords
  }
}