import fs from "fs"

/**
 * 透過公開分享連結獲取 Google Sheets 資料
 */
async function fetchFromGoogleSheets() {
  // 使用公開分享連結的 CSV 匯出格式
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1ETmr595ePinGSmvS8hWoW8hHV7zxi1-I9I5NK4Lee3k/export?format=csv&gid=165568874"

  try {
    console.log("正在從公開 Google Sheets 獲取資料...")

    const response = await fetch(sheetUrl)
    if (!response.ok) {
      throw new Error(`Google Sheets 請求錯誤: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("成功獲取 CSV 資料")

    // 解析 CSV 為二維陣列
    const rows = parseCsv(csvText)
    console.log(`解析得到 ${rows.length} 行資料`)

    return rows
  } catch (error) {
    console.error("無法從 Google Sheets 獲取資料:", error.message)
    return null
  }
}

/**
 * 簡單的 CSV 解析器
 */
function parseCsv(csvText) {
  const lines = csvText.split("\n")
  const rows = []

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    // 簡單解析，處理引號包圍的欄位
    const row = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        row.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    // 加入最後一個欄位
    row.push(current.trim())
    rows.push(row)
  }

  return rows
}

/**
 * 從 Google Sheets 原始資料轉換為推文格式
 */
function convertSheetsDataToTweets(rows) {
  if (!rows || rows.length <= 1) return []

  const tweets = []
  let tweetId = 1

  // 跳過標題行
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length < 2) continue

    const [timestamp, name, avatar, message, giftFiles] = row
    if (!name || !message) continue

    // 過濾掉包含 Google Drive 連結的異常資料
    if (
      name.includes("drive.google.com") ||
      message.includes("drive.google.com") ||
      (timestamp && timestamp.includes("drive.google.com"))
    ) {
      console.log(`跳過包含 Google Drive 連結的異常資料: ${name}`)
      continue
    }

    // 從 name 生成 username
    const username = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15)

    tweets.push({
      id: tweetId.toString(),
      author: {
        name: name.trim(),
        username: username || `user${tweetId}`,
      },
      content: message.trim(),
      timestamp: timestamp || "未知時間",
      likes: Math.floor(Math.random() * 50) + 1,
      retweets: Math.floor(Math.random() * 10),
      replies: Math.floor(Math.random() * 5),
      isLiked: Math.random() > 0.7,
      isRetweeted: Math.random() > 0.8,
    })

    tweetId++
  }

  return tweets.reverse() // 倒序顯示
}

/**
 * 從 Google Sheets 更新推文資料的腳本
 */

// 主流程：從 Google Sheets 取得資料、轉換、寫入、整理媒體
async function updateFromGoogleSheets() {
  console.log("正在從 Google Sheets 獲取最新資料...")
  try {
    // 取得原始資料
    const rows = await fetchFromGoogleSheets()
    if (!rows || rows.length <= 1) {
      console.log("未獲取到資料，可能需要配置 Google Sheets API")
      return
    }
    // 轉換為推文格式
    const tweets = convertSheetsDataToTweets(rows)
    if (!tweets.length) {
      console.log("無有效推文資料")
      return
    }
    // 寫入 JSON 檔案
    const cleanTweets = tweets.map((tweet) => ({
      id: tweet.id,
      author: {
        name: tweet.author.name,
        username: tweet.author.username,
      },
      content: tweet.content,
      timestamp: tweet.timestamp,
      likes: tweet.likes,
      retweets: tweet.retweets,
      replies: tweet.replies,
      isLiked: tweet.isLiked,
      isRetweeted: tweet.isRetweeted,
      // 保證 media 欄位型別正確
      media: Array.isArray(tweet.media) ? tweet.media : undefined,
      repliesData: Array.isArray(tweet.repliesData)
        ? tweet.repliesData
        : undefined,
    }))
    const updatedData = { tweets: cleanTweets }
    // 備份舊檔案
    const backupFile = `./src/data/tweets-backup-${Date.now()}.json`
    if (fs.existsSync("./src/data/tweets.json")) {
      fs.copyFileSync("./src/data/tweets.json", backupFile)
      console.log(`已備份舊資料至: ${backupFile}`)
    }
    fs.writeFileSync(
      "./src/data/tweets.json",
      JSON.stringify(updatedData, null, 2),
    )
    console.log("✅ 成功更新推文資料")
    console.log("🔄 現在重新執行媒體整理腳本...")
    // 重新執行媒體整理
    const { execSync } = await import("child_process")
    try {
      execSync("node scripts/organize-media.js", {
        stdio: "inherit",
        cwd: process.cwd(),
      })
      console.log("✅ 媒體整理完成")
    } catch (error) {
      console.error("❌ 媒體整理失敗:", error.message)
    }
  } catch (error) {
    console.error("❌ 更新失敗:", error)
  }
}

// 執行更新
updateFromGoogleSheets()
