function clear(text) {
  return (text || "").toLowerCase().split(/\W+/).filter(Boolean);
}

exports.ChunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk.trim());
    i += chunkSize - overlap;
  }

  return chunks;
};

exports.FindRelevantChunks = (question, chunks, topK = 3) => {
  const questionWord = clear(question);
  const scoreChunks = chunks.map((chunk, index) => {
    const chunkWords = clear(chunk);
    const score = questionWord.filter((word) =>
      chunkWords.includes(word)
    ).length;
    return { chunk, score, index };
  });

  const sort = scoreChunks.sort((a, b) => b.score - a.score);
  return sort.slice(0, topK).map((item) => item.chunk);
};
