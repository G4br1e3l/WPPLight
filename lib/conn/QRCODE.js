import ax from "axios";
const { get, post } = ax;

const GetQR = async (dataa) => {
  
  const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'Content-Length': (483 + (dataa.split('')).length),
    'Content-Type': 'text/plain;charset=UTF-8',
    'Dnt': '1',
    'Origin': 'https://www.qrcode-monkey.com',
    'Referer': 'https://www.qrcode-monkey.com/',
    'Sec-Ch-Ua': '"Chromium";v="116", "Not A Brand";v="24", "Microsoft Edge";v="116"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': 'Windows',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.76',
  };

  const payload = {
    "data": dataa,
    "config": {
      "body": "square",
      "eye": "frame0",
      "eyeBall": "ball0",
      "erf1": [],
      "erf2": [],
      "erf3": [],
      "brf1": [],
      "brf2": [],
      "brf3": [],
      "bodyColor": "#000000",
      "bgColor": "#FFFFFF",
      "eye1Color": "#000000",
      "eye2Color": "#000000",
      "eye3Color": "#000000",
      "eyeBall1Color": "#000000",
      "eyeBall2Color": "#000000",
      "eyeBall3Color": "#000000",
      "gradientColor1": "",
      "gradientColor2": "",
      "gradientType": "linear",
      "gradientOnEyes": "true",
      "logo": "",
      "logoMode": "default"
    },
    "size": 1000,
    "download": "imageUrl",
    "file": "svg"
  };

  await post('https://api.qrcode-monkey.com//qr/custom', JSON.stringify(payload), { headers: headers })
    .then(response => {
      console.log(response.data.imageUrl)
    })
    .catch(error => {
      console.error(error);
    });
}

export {
  GetQR,
}