const imageScaleFactor = 0.2;
const outputStride = 16;
const flipHorizontal = false;
const stats = new Stats();
const contentWidth = 270;
const contentHeight = 480;
var audio = new Audio('footstep.m4a');
var end = false;
var dateArrR = [
  ["part_R", "time_R", "x_R", "y_R"]
];
var dateArrL = [
  ["part_L", "time_L", "x_L", "y_L"]
];
var dateArrLK = [
  ["part_LK", "time_LK", "x_LK", "y_LK"]
];
var dateArrRK = [
  ["part_RK", "time_RK", "x_RK", "y_RK"]
];
var dateArr = [
  ["part", "time", "x", "y"]
];

function startEstimation() {
  start();
}

async function start() {
  const net = await posenet.load(); // posenetの呼び出し
  let video;
  try {
    video = await loadVideo(); // video属性をロード
  } catch (e) {
    console.error(e);
    return;
  }
  detectPoseInRealTime(video, net);
}

// video属性のロード
async function loadVideo() {
  var video = document.getElementById('video')
  video.play();
  video.addEventListener("ended", function() {
    end = true;
  }, false);
  return video;
}

// 取得したストリームをestimateSinglePose()に渡して姿勢予測を実行
// requestAnimationFrameによってフレームを再描画し続ける
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const flipHorizontal = true; // since images are being fed from a webcam
  var time;

  async function poseDetectionFrame() {
    stats.begin();
    let poses = [];
    const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
    poses.push(pose);

    ctx.clearRect(0, 0, contentWidth, contentHeight);

    // ctx.save();
    // ctx.scale(-1, 1);
    // ctx.translate(-contentWidth, 0);
    // ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
    // ctx.restore();

    poses.forEach(({
      score,
      keypoints
    }) => {
      time = video.currentTime;
      // keypoints[15]には左足、keypoints[16]には右足の予測結果が格納されている
      drawWristPoint(keypoints[13], ctx);
      drawWristPoint(keypoints[14], ctx);
      drawWristPoint(keypoints[15], ctx);
      drawWristPoint(keypoints[16], ctx);
      makeArr(keypoints[13].part, time, keypoints[13].position.x,
        keypoints[13].position.y);
      makeArr(keypoints[14].part, time, keypoints[14].position.x,
        keypoints[14].position.y);
      makeArr(keypoints[15].part, time, keypoints[15].position.x,
        keypoints[15].position.y);
      makeArr(keypoints[16].part, time, keypoints[16].position.x,
        keypoints[16].position.y);
    });

    // audio.play();

    stats.end();

    if (video.ended) {
      makeArrResult();
      (new CSV(dateArr)).save('dateArr.csv');
    }
    if (!video.ended) {
      requestAnimationFrame(poseDetectionFrame);
    }
  }
  poseDetectionFrame();
}

// 与えられたKeypointをcanvasに描画する
function drawWristPoint(wrist, ctx) {
  ctx.beginPath();
  ctx.arc(wrist.position.x, wrist.position.y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "pink";
  ctx.fill();
}

function makeArr(part, x, y, time) {
  if (part == "leftKnee") {
    dateArrLK.push([part, x, y, time]);
  }
  if (part == "rightKnee") {
    dateArrRK.push([part, x, y, time]);
  }
  if (part == "leftAnkle") {
    dateArrL.push([part, x, y, time]);
  }
  if (part == "rightAnkle") {
    dateArrR.push([part, x, y, time]);
  }
}

function makeArrResult() {
  dateArr = dateArrR.concat(dateArrRK.concat(dateArrL.concat(dateArrLK)));
}

class CSV {
  constructor(data, keys = false) {
    this.ARRAY = Symbol('ARRAY')
    this.OBJECT = Symbol('OBJECT')

    this.data = data

    if (CSV.isArray(data)) {
      if (0 == data.length) {
        this.dataType = this.ARRAY
      } else if (CSV.isObject(data[0])) {
        this.dataType = this.OBJECT
      } else if (CSV.isArray(data[0])) {
        this.dataType = this.ARRAY
      } else {
        throw Error('Error: 未対応のデータ型です')
      }
    } else {
      throw Error('Error: 未対応のデータ型です')
    }

    this.keys = keys
  }

  toString() {
    if (this.dataType === this.ARRAY) {
      return this.data.map((record) => (
        record.map((field) => (
          CSV.prepare(field)
        )).join(',')
      )).join('\n')
    } else if (this.dataType === this.OBJECT) {
      const keys = this.keys || Array.from(this.extractKeys(this.data))

      const arrayData = this.data.map((record) => (
        keys.map((key) => record[key])
      ))

      console.log([].concat([keys], arrayData))

      return [].concat([keys], arrayData).map((record) => (
        record.map((field) => (
          CSV.prepare(field)
        )).join(',')
      )).join('\n')
    }
  }

  save(filename = 'data.csv') {
    if (!filename.match(/\.csv$/i)) {
      filename = filename + '.csv'
    }

    console.info('filename:', filename)
    console.table(this.data)

    const csvStr = this.toString()

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvStr], {
      'type': 'text/csv'
    });
    const url = window.URL || window.webkitURL;
    const blobURL = url.createObjectURL(blob);

    let a = document.createElement('a');
    a.download = decodeURI(filename);
    a.href = blobURL;
    a.type = 'text/csv';

    a.click();
  }

  extractKeys(data) {
    return new Set([].concat(...this.data.map((record) => Object.keys(record))))
  }

  static prepare(field) {
    return '"' + ('' + field).replace(/"/g, '""') + '"'
  }

  static isObject(obj) {
    return '[object Object]' === Object.prototype.toString.call(obj)
  }

  static isArray(obj) {
    return '[object Array]' === Object.prototype.toString.call(obj)
  }
}
