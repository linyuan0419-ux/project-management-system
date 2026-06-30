// 日期工具函数

/**
 * 获取当前日期（YYYY-MM-DD格式）
 */
export const getToday = (): string => {
  return new Date().toISOString().split('T')[0]
}

/**
 * 获取当前日期时间（本地格式）
 */
export const getNow = (): string => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * 获取未来N天的日期
 */
export const getFutureDate = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

/**
 * 检查日期是否已过期
 */
export const isOverdue = (date: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)
  return targetDate < today
}

/**
 * 检查日期是否是今天
 */
export const isToday = (date: string): boolean => {
  return date === getToday()
}

/**
 * 获取相对时间描述（今天、昨天、明天、N天前/后）
 */
export const getRelativeTime = (date: string): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)
  
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === -1) return '昨天'
  if (diffDays === 1) return '明天'
  if (diffDays < -1) return `${Math.abs(diffDays)}天前`
  return `${diffDays}天后`
}

/**
 * 计算两个日期之间的天数
 */
export const getDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
