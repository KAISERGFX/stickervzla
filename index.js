const { create, decryptMedia } = require("@open-wa/wa-automate");

function start(client) {
  client.onAnyMessage(async (message) => {
    const { isMe, isMedia, caption, from, type, mimetype } = message;
    let stickerMetadata = {
      pack: "Stickers",
      author: "@xkaiserw",
      keepScale: true,
    };
    if (isMedia && typeof caption === 'string' && caption.toLowerCase() === "sticker") {
      if (mimetype.startsWith("image/") || mimetype.startsWith("video/")) {
        const mediaData = await decryptMedia(message);
        const receiver = isMe ? from : from;
        if (mimetype.startsWith("video/")) {
          await client.sendMp4AsSticker(receiver, mediaData, null, stickerMetadata);
        } else {
          await client.sendImageAsSticker(
            receiver,
            `data:${mimetype};base64,${mediaData.toString("base64")}`,
            stickerMetadata
          );
        }
      }
    }
  });
}

create().then(start).catch((error) => console.error(error));
