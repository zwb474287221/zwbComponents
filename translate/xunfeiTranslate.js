/**
 * 讯飞机器翻译 WebAPI 接口
 * 运行前：请先填写Appid、APIKey、APISecret
 * 运行方法：直接运行 main() 即可
 * 结果： 控制台输出结果信息
 *
 * 1.接口文档（必看）：https://www.xfyun.cn/doc/nlp/xftrans/API.html
 * 2.错误码链接：https://www.xfyun.cn/document/error-code （错误码code为5位数字）
 * @author iflytek
 */
const CryptoJS = require('crypto-js');
var axios = require('axios');

// 系统配置
const config =require('./config').default;

// 生成请求body
function getPostBody(text, from, to) {
  let digestObj = {
    //填充common
    common: {
      app_id: config.xunfeiappid,
    },
    //填充business
    business: {
      from: from,
      to: to,
    },
    //填充data
    data: {
      text: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text)),
    },
  };
  return digestObj;
}

// 请求获取请求体签名
function getDigest(body) {
  return 'SHA-256=' + CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(JSON.stringify(body)));
}

// 鉴权签名
function getAuthStr(date, digest) {
  let signatureOrigin = `host: ${config.xunfeihost}\ndate: ${date}\nPOST ${config.xunfeiuri} HTTP/1.1\ndigest: ${digest}`;
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.xunfeiapiSecret);
  let signature = CryptoJS.enc.Base64.stringify(signatureSha);
  let authorizationOrigin = `api_key="${config.xunfeiapiKey}", algorithm="hmac-sha256", headers="host date request-line digest", signature="${signature}"`;
  return authorizationOrigin;
}

async function translate(from, to, content) {
  // 获取当前时间 RFC1123格式
  let date = (new Date().toUTCString());
  let postBody = getPostBody(content, from, to);
  let digest = getDigest(postBody);
  return await axios.post(config.xunfeihostUrl, postBody, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json,version=1.0',
      'Host': config.xunfeihost,
      'Date': date,
      'Digest': digest,
      'Authorization': getAuthStr(date, digest),
    },
  }).then(response => {
    return response.data.data.result.trans_result.dst;
  }).catch(err=>{
    console.log(err);
  });
}

const znCN = require('./zh-CN').default;
const path = require('path');
const to = ['ar', 'vi','hi','id'];
// const to = ['id'];
const keys = Object.keys(znCN);

const fs = require('fs');

async function toTranslate(to) {
  console.time(to);
  const dirPath = path.resolve(__dirname,`./${to.key}`);
  try{
    await fs.statSync(dirPath);
  }catch(e){
    await fs.mkdirSync(dirPath);
  }
  let result;
  try{
    result = require(`./${to}/index.es5`).default;
  } catch (e) {
    result={};
  };
  const error = {};
  for (let key of keys) {
    let fy;
    try {
      fy = await translate('cn', to, znCN[key]);
    } catch (e) {
      console.log(e);
      error[key] = znCN[key];
    }
    console.log(key, znCN[key], fy);
    result[key] = fy;
  }
  const newPath = path.resolve(__dirname, `./${to}/index.js`);
  fs.appendFile(newPath, 'exports.default=' + JSON.stringify(result),()=>{

  })
  const newPath2 = path.resolve(__dirname, `./${to}/index.es5.js`);
  fs.appendFile(newPath2, 'exports.default=' + JSON.stringify(result),()=>{

  })

  if (Object.keys(error).length) {
    const newErrorPath = path.resolve(__dirname, `/${to}/${to}Error${Date.now()}.js`);
    fs.appendFile(newErrorPath, JSON.stringify(error),()=>{
      
    })
  }
  console.timeEnd(to);
};

function main(){
  return to.map(toTranslate);
}
main();


