// TypeScript 介面定義
interface Author {
  name: string
  username: string
  avatar: string
}

interface JsonItem {
  id: string
  author: Author
  content: string
  timestamp: string
  likes: number
  retweets: number
  replies: number
  isLiked: boolean
  isRetweeted: boolean
}

interface CsvRow {
  時間戳記: string
  "你想留下的名字！（也可以寫匿名沒有問題）": string
  "想要在網站上放的頭貼！當然想跳過也沒問題！（請幫忙把檔案格式命名為圖中的格式－你的名字+頭貼喔~例如Popapo_頭貼）": string
  "想對吐司說的話！": string
  "想給吐司的東西！(請幫忙把檔案格式命名為圖中的格式－  你的名字+物品名稱喔~例如Popapo_生日快樂歌錄音檔，匿名者寫成匿名_XXXXX即可)": string
}

/**
 * 將 CSV 資料轉換為指定的 JSON 格式
 */
function convertCsvToJson(csvData: CsvRow[]): JsonItem[] {
  return csvData.map((row, index) => {
    // 處理名字，如果為空或null則設為"匿名"
    const name = row["你想留下的名字！（也可以寫匿名沒有問題）"] || "匿名"

    // 生成username（簡化版本的name，去除特殊字符並轉小寫）
    const username =
      name.replace(/[^\w\u4e00-\u9fa5]/g, "").toLowerCase() ||
      `user${index + 1}`

    // 處理頭貼路徑
    const avatarData =
      row[
        "想要在網站上放的頭貼！當然想跳過也沒問題！（請幫忙把檔案格式命名為圖中的格式－你的名字+頭貼喔~例如Popapo_頭貼）"
      ]
    const avatar = avatarData
      ? `/img/${index + 1}/avatar.png`
      : "/img/default/avatar.png"

    // 處理內容
    const content = row["想對吐司說的話！"] || ""

    // 處理時間戳記
    const timestamp = row["時間戳記"] || ""

    // 隨機生成互動數據
    const likes = Math.floor(Math.random() * 100) + 1
    const retweets = Math.floor(Math.random() * 100) + 1
    const replies = Math.floor(Math.random() * 20)

    return {
      id: (index + 1).toString(),
      author: {
        name,
        username,
        avatar,
      },
      content,
      timestamp,
      likes,
      retweets,
      replies,
      isLiked: Math.random() > 0.5,
      isRetweeted: Math.random() > 0.5,
    }
  })
}

/**
 * 使用 Papa Parse 解析 CSV 檔案並轉換為 JSON
 * 需要先安裝: npm install papaparse @types/papaparse
 */
function parseAndConvertCsv(csvContent: string): JsonItem[] {
  // 如果在 Node.js 環境中使用
  // const Papa = require('papaparse');

  // 如果在瀏覽器環境中使用
  // import Papa from 'papaparse';

  const parseResult = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimitersToGuess: [",", "\t", "|", ";"],
  })

  return convertCsvToJson(parseResult.data as CsvRow[])
}

/**
 * 從檔案讀取並轉換 CSV（Node.js 環境）
 */
async function convertCsvFileToJson(filePath: string): Promise<JsonItem[]> {
  const fs = require("fs").promises

  try {
    const csvContent = await fs.readFile(filePath, "utf8")
    return parseAndConvertCsv(csvContent)
  } catch (error) {
    console.error("讀取檔案失敗:", error)
    throw error
  }
}

/**
 * 瀏覽器環境中處理檔案上傳
 */
function handleFileUpload(file: File): Promise<JsonItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string
        const result = parseAndConvertCsv(csvContent)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("檔案讀取失敗"))
    reader.readAsText(file, "utf-8")
  })
}

// 使用範例
export {
  convertCsvToJson,
  parseAndConvertCsv,
  convertCsvFileToJson,
  handleFileUpload,
  type JsonItem,
  type Author,
  type CsvRow,
}

// JavaScript 版本（如果不需要 TypeScript）
/*
function convertCsvToJsonJS(csvData) {
  return csvData.map((row, index) => {
    const name = row['你想留下的名字！（也可以寫匿名沒有問題）'] || '匿名';
    const username = name.replace(/[^\w\u4e00-\u9fa5]/g, '').toLowerCase() || `user${index + 1}`;
    const avatarData = row['想要在網站上放的頭貼！當然想跳過也沒問題！（請幫忙把檔案格式命名為圖中的格式－你的名字+頭貼喔~例如Popapo_頭貼）'];
    const avatar = avatarData ? `/img/${index + 1}/avatar.png` : '/img/default/avatar.png';
    const content = row['想對吐司說的話！'] || '';
    const timestamp = row['時間戳記'] || '';
    
    return {
      id: (index + 1).toString(),
      author: {
        name,
        username,
        avatar
      },
      content,
      timestamp,
      likes: Math.floor(Math.random() * 100) + 1,
      retweets: Math.floor(Math.random() * 100) + 1,
      replies: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.5,
      isRetweeted: Math.random() > 0.5
    };
  });
}
*/
