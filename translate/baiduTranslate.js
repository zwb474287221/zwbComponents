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

// 系统配置
const config =require('./config').default;

// 请求获取请求体签名
function getDigest(query,salt) {
  const str = config.baiduappid + query + salt +config.baiduapiKey;
  const md5 = CryptoJS.MD5(str).toString();
  return md5;
}

// 生成请求body
function getPostBody(text, from, to) {
  const salt=Date.now();
  // const salt=8872;
  // console.log({salt});

  return {
    q	:text,
    from,
    to,
    appid:config.baiduappid,
    salt,
    sign:getDigest(text,salt),
  };
}

function baiduTranslate(from, to, content) {
  // 获取当前时间 RFC1123格式
  let postBody = getPostBody(content, from, to);
  // console.log({postBody});
  return axios.get(config.baiduhostUrl,{
    params:postBody
  }).then(response => {
    console.log(response.data);
    // console.log(response.trans_result);
    return response.data.trans_result.dst;
  }).catch(err=>{
    console.log(err);
  });
}

const znCN = require('./zh-CN').default;
const path = require('path');
const to = [
  {key:'ar',to:'ara',cn:'阿拉伯'},
  {key:'vi',to:'vie',cn:'越南'},
];
const keys = Object.keys(znCN);

const fs = require('fs');
async function  toTranslate(to) {
  console.time(to.key);
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
      fy = await baiduTranslate('zh', to.to, znCN[key]);
      console.log({fy});
    } catch (e) {
      console.log(e);
      error[key] = znCN[key];
    }
    console.log(key, znCN[key], fy);
    result[key] = fy;
  }
  const newPath = path.resolve(__dirname, `./${to.key}/index.js`);
  fs.appendFile(newPath, 'exports.default=' + JSON.stringify(result),(error)=>{
    console.log(error);
  })
  const newPath2 = path.resolve(__dirname, `./${to.key}/index.es5.js`);
  fs.appendFile(newPath2, 'exports.default=' + JSON.stringify(result),(error)=>{
    console.log(error);
  })

  if (Object.keys(error).length) {
    const newErrorPath = path.resolve(__dirname, `/${to.key}/${to.key}Error${Date.now()}.js`);
    fs.appendFile(newErrorPath, JSON.stringify(error),()=>{

    })
  }
  console.timeEnd(to);
};

function main(){
  return to.map(toTranslate);
}
main();
//
