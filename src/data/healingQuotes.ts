// 治愈文案库 - 每次随机显示
export const healingQuotes = [
  // 温暖治愈系
  { title: '下午好，记得抽空休息一下', subtitle: '星光不问赶路人，时光不负有心人。' },
  { title: '工作再忙，也要记得微笑', subtitle: '生活明朗，万物可爱。' },
  { title: '你已经做得很好了', subtitle: '慢慢来，好戏都在烟火里。' },
  { title: '今天的你也辛苦了', subtitle: '愿所有的美好，都如约而至。' },
  { title: '休息一下，喝杯茶吧', subtitle: '人间烟火气，最抚凡人心。' },
  
  // 励志治愈系
  { title: '保持热爱，奔赴山海', subtitle: '追光的人，终会光芒万丈。' },
  { title: '每一个不曾起舞的日子', subtitle: '都是对生命的辜负。' },
  { title: '你的努力，终将绽放', subtitle: '花开不是为了花落，而是为了开得更加灿烂。' },
  { title: '慢慢来，比较快', subtitle: '流水不争先，争的是滔滔不绝。' },
  { title: '今天的汗水，是明天的礼物', subtitle: '努力的意义，就是成为更好的自己。' },
  
  // 温柔治愈系
  { title: '世界很大，你很好', subtitle: '愿你被这个世界温柔以待。' },
  { title: '累了就歇会儿吧', subtitle: '人生不是马拉松，偶尔停下来看看风景。' },
  { title: '你值得所有美好', subtitle: '生活原本沉闷，但跑起来就有风。' },
  { title: '别担心，一切都会好的', subtitle: '阳光正好，微风不燥，万物可爱。' },
  { title: '给自己一个拥抱吧', subtitle: '爱自己，是终身浪漫的开始。' },
  
  // 诗意治愈系
  { title: '且将新火试新茶，诗酒趁年华', subtitle: '活在当下，不负韶华。' },
  { title: '山有顶峰，湖有彼岸', subtitle: '在人生漫漫长途中，万物皆有回转。' },
  { title: '慢品人间烟火色', subtitle: '闲观万事岁月长。' },
  { title: '心若向阳，无惧悲伤', subtitle: '微笑向暖，安之若素。' },
  { title: '岁月漫长，值得等待', subtitle: '最好的总在不经意间出现。' },
  
  // 轻松治愈系
  { title: '生活嘛，笑一笑就好', subtitle: '开心最重要，其他都是浮云。' },
  { title: '今天也要元气满满', subtitle: '做个快乐的大人，奔赴简单快乐的生活。' },
  { title: '小确幸就在身边', subtitle: '发现美好，感受美好，成为美好。' },
  { title: '放轻松，一切都会顺利的', subtitle: '船到桥头自然直，柳暗花明又一村。' },
  { title: '别忘了，有人在默默支持你', subtitle: '你不是一个人在战斗。' },
  
  // 深夜/加班治愈系
  { title: '夜深了，记得早点休息', subtitle: '月亮不睡我不睡，但我还是要劝你早睡。' },
  { title: '加班辛苦了', subtitle: '星光不负赶路人，你走的每一步都算数。' },
  { title: '再坚持一下，天就亮了', subtitle: '熬过无人问津的日子，才有诗和远方。' },
  { title: '累了就抬头看看星空', subtitle: '宇宙山河浪漫，生活点滴温暖。' },
  { title: '今天的努力，是明天的底气', subtitle: '愿你所有的坚持，都能换来想要的结果。' },
]

// 获取随机文案
export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * healingQuotes.length)
  return healingQuotes[index]
}

// 根据时间段获取问候语
export const getGreetingByTime = (): string => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，早点休息'
  if (hour < 9) return '早上好，新的一天开始了'
  if (hour < 12) return '上午好，保持专注'
  if (hour < 14) return '中午好，记得吃饭'
  if (hour < 18) return '下午好，记得抽空休息一下'
  if (hour < 22) return '晚上好，今天辛苦了'
  return '夜深了，早点休息'
}
