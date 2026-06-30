// 数据同步工具
// 用于将 Pinia store 数据自动同步到 IndexedDB

import { saveData, getData, initDB } from '../utils/db'

// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => fn(...args), delay)
  }
}

// 自动保存到 IndexedDB
export const autoSave = (storeName: string, data: any, key?: string) => {
  const save = debounce(() => {
    saveData(storeName, data, key).catch(console.error)
  }, 500)
  save()
}

// 从 IndexedDB 加载数据
export const loadData = async (storeName: string, key?: string): Promise<any> => {
  try {
    await initDB()
    const data = await getData(storeName, key)
    return data
  } catch (error) {
    console.error('加载数据失败:', error)
    return null
  }
}

// 同步状态（用于 watch）
export const createSyncWatcher = (storeName: string, key?: string) => {
  return {
    handler: (newVal: any) => {
      autoSave(storeName, newVal, key)
    },
    deep: true,
    immediate: false
  }
}
