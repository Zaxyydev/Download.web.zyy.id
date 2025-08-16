const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint download
app.get('/download', async (req, res) => {
  const { url, platform, format } = req.query;

  if(!url || !platform || !format) return res.status(400).send('Missing parameters');

  let apiUrl = '';

  // Contoh placeholder API
  if(platform === 'tiktok'){
    apiUrl = format === 'video'
      ? `https://ssstik.io/abc?url=${encodeURIComponent(url)}`
      : `https://ssstik.io/abc-mp3?url=${encodeURIComponent(url)}`;
  } 
  else if(platform === 'youtube'){
    apiUrl = format === 'video'
      ? `https://youtube-download-api.matheusishiyama.repl.co/mp4/?url=${encodeURIComponent(url)}`
      : `https://youtube-download-api.matheusishiyama.repl.co/mp3/?url=${encodeURIComponent(url)}`;
  } 
  else if(platform === 'instagram'){
    apiUrl = format === 'video'
      ? `https://apify.com/scraper-mind/instagram-video-downloader/api?url=${encodeURIComponent(url)}`
      : '';
  }

  if(!apiUrl) return res.status(400).send('Format tidak tersedia');

  try{
    const response = await fetch(apiUrl);
    const data = await response.buffer();
    res.setHeader('Content-Disposition', `attachment; filename=download.${format==='audio'?'mp3':'mp4'}`);
    res.setHeader('Content-Type','application/octet-stream');
    res.send(data);
  } catch(err){
    res.status(500).send('Gagal mendownload video');
  }
});

app.listen(PORT, ()=> console.log(`Server running at http://localhost:${PORT}`));