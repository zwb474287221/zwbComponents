/**
 * 机器翻译 WebAPI 接口调用示例
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

const config =require('./config').default;

function truncate(q){
  var len = q.length;
  if(len<=20) return q;
  return q.substring(0, 10) + len + q.substring(len-10, len);
}

// 请求获取请求体签名
function getDigest(query,salt) {
  var str = config.youdaoappid + truncate(query) + salt + Math.round(salt/1000) + config.youdaoapiKey;
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

// 生成请求body
function getPostBody(text, from, to) {
  var salt = Date.now();
  return {
    q: text,
    appKey: config.youdaoappid,
    salt: salt,
    from: from,
    to: to,
    sign: getDigest(text,salt),
    signType: "v3",
    curtime: Math.round(Date.now()/1000),
  }
}

async function translate(from, to, content) {
  let postBody = getPostBody(content, from, to);
  return await axios.get(config.youdaohostUrl, {
    params:postBody
  }).then(response => {
    console.log(response.data);
    return response.data.translation[0];
  }).catch(err=>{
    console.log(err);
  });
}

const znCN = require('./zh-CN').default;
const path = require('path');
// const to = ['ar', 'vi','hi','id'];
const to = ['hi','id'];
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


