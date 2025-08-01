import fs from "fs"
import path from "path"

// 掃描附件檔案
function scanMediaFiles() {
  const mediaMap = {}
  const imgDir = "./public/img"

  try {
    const folders = fs
      .readdirSync(imgDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => /^\d+$/.test(name)) // 只取數字資料夾

    folders.forEach((folderId) => {
      const folderPath = path.join(imgDir, folderId)

      try {
        const files = fs
          .readdirSync(folderPath)
          .filter((file) => !file.startsWith(".") && file !== "avatar.png") // 排除隱藏檔案和頭像
          .filter((file) => /\.(jpg|jpeg|png|gif|mp4)$/i.test(file))
          .sort((a, b) => {
            // 按照檔名數字順序排序 (00.png, 01.gif, 02.png, ...)
            const aNum = parseInt(a.split(".")[0]) || 0
            const bNum = parseInt(b.split(".")[0]) || 0
            return aNum - bNum
          })

        if (files.length > 0) {
          mediaMap[folderId] = files.map((file) => `/img/${folderId}/${file}`)
          console.log(`資料夾 ${folderId}: 找到 ${files.length} 個媒體檔案`)
        }
      } catch {
        console.log(`資料夾 ${folderId} 不存在或無法讀取`)
      }
    })
  } catch (error) {
    console.error("Error scanning media files:", error)
  }

  return mediaMap
}

// 更新貼文資料，加入媒體檔案
function updateTweetsWithMedia() {
  const mediaMap = scanMediaFiles()

  // 讀取現有的推文資料
  const tweetsData = JSON.parse(
    fs.readFileSync("./src/data/tweets.json", "utf8"),
  )

  // 創建 ID 對照表
  const idToMediaMap = {}
  Object.keys(mediaMap).forEach((folderId) => {
    idToMediaMap[folderId] = mediaMap[folderId]
  })

  // 更新貼文資料，倒序處理（從最新到最舊）
  const updatedTweets = tweetsData.tweets.map((tweet) => {
    const mediaFiles = idToMediaMap[tweet.id] || []

    // 限制貼文最多4個附件
    const tweetMedia = mediaFiles.slice(0, 4)
    const remainingMedia = mediaFiles.slice(4)

    const updatedTweet = {
      ...tweet,
      media: tweetMedia.length > 0 ? tweetMedia : undefined,
    }

    // 如果有剩餘附件且該貼文有回覆，將剩餘附件分配給回覆
    if (remainingMedia.length > 0 && tweet.replies > 0) {
      const repliesData = []
      let mediaIndex = 0

      // 生成模擬回覆，每個回覆最多4個附件
      for (
        let i = 0;
        i < tweet.replies && mediaIndex < remainingMedia.length;
        i++
      ) {
        const replyMedia = remainingMedia.slice(mediaIndex, mediaIndex + 4)
        mediaIndex += 4

        repliesData.push({
          id: `${tweet.id}-reply-${i + 1}`,
          author: {
            name: "支持者",
            username: "supporter",
          },
          content: "來自支持者的回覆 ❤️",
          timestamp: tweet.timestamp,
          likes: Math.floor(Math.random() * 10) + 1,
          media: replyMedia.length > 0 ? replyMedia : undefined,
        })
      }

      if (repliesData.length > 0) {
        updatedTweet.repliesData = repliesData
      }
    }

    return updatedTweet
  })

  return {
    tweets: updatedTweets,
  }
}

// 生成更新後的資料
const updatedData = updateTweetsWithMedia()

// 輸出結果
console.log("Media mapping completed:")
console.log(`處理了 ${updatedData.tweets.length} 條貼文`)

// 統計媒體檔案
const mediaCount = updatedData.tweets.filter((tweet) => tweet.media).length
const replyMediaCount = updatedData.tweets.reduce((count, tweet) => {
  return (
    count +
    (tweet.repliesData
      ? tweet.repliesData.filter((reply) => reply.media).length
      : 0)
  )
}, 0)

console.log(`有媒體的貼文: ${mediaCount}`)
console.log(`有媒體的回覆: ${replyMediaCount}`)

// 寫入檔案
fs.writeFileSync("./src/data/tweets.json", JSON.stringify(updatedData, null, 2))
console.log("✅ 媒體整理完成，已更新 tweets.json")
