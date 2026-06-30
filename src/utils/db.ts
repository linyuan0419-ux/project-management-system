// IndexedDB 数据库封装
// 用于持久化存储项目数据、任务状态、小猫状态等

const DB_NAME = 'PMSystemDB'
const DB_VERSION = 1

// 数据库连接
let db: IDBDatabase | null = null

// 初始化数据库
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // 存储项目数据
      if (!database.objectStoreNames.contains('projects')) {
        database.createObjectStore('projects', { keyPath: 'id' })
      }

      // 存储任务数据
      if (!database.objectStoreNames.contains('tasks')) {
        database.createObjectStore('tasks', { keyPath: 'id' })
      }

      // 存储供应商数据
      if (!database.objectStoreNames.contains('suppliers')) {
        database.createObjectStore('suppliers', { keyPath: 'id' })
      }

      // 存储创意部排期
      if (!database.objectStoreNames.contains('schedules')) {
        database.createObjectStore('schedules', { keyPath: 'id' })
      }

      // 存储设计师列表
      if (!database.objectStoreNames.contains('designers')) {
        database.createObjectStore('designers', { keyPath: 'name' })
      }

      // 存储小猫状态
      if (!database.objectStoreNames.contains('catState')) {
        database.createObjectStore('catState', { keyPath: 'key' })
      }

      // 存储库存
      if (!database.objectStoreNames.contains('inventory')) {
        database.createObjectStore('inventory', { keyPath: 'key' })
      }

      // 存储今日任务完成数
      if (!database.objectStoreNames.contains('todayStats')) {
        database.createObjectStore('todayStats', { keyPath: 'key' })
      }
    }
  })
}

// 保存数据
export const saveData = async (storeName: string, data: any, key?: string): Promise<void> => {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    const item = key ? { key, ...data } : data
    const request = store.put(item)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// 获取数据
export const getData = async (storeName: string, key?: string): Promise<any> => {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)

    let request: IDBRequest
    if (key) {
      request = store.get(key)
    } else {
      request = store.getAll()
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 删除数据
export const deleteData = async (storeName: string, key: string): Promise<void> => {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// 清空存储
export const clearStore = async (storeName: string): Promise<void> => {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// 导出所有数据（用于备份）
export const exportAllData = async (): Promise<Record<string, any[]>> => {
  const stores = ['projects', 'tasks', 'suppliers', 'schedules', 'designers', 'catState', 'inventory', 'todayStats']
  const result: Record<string, any[]> = {}
  
  for (const store of stores) {
    result[store] = await getData(store) || []
  }
  
  return result
}

// 导入数据（用于恢复）
export const importAllData = async (data: Record<string, any[]>): Promise<void> => {
  for (const [storeName, items] of Object.entries(data)) {
    await clearStore(storeName)
    for (const item of items) {
      await saveData(storeName, item)
    }
  }
}
