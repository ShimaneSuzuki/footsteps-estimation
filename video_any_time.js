var audio = new Audio('footstep.m4a');
var end = false;
var dateArr = [2.368,3.139,3.884,4.622,5.320,6.008,1.839,2.822,3.554,4.243,4.970,5.683];
var frame = 0;
var video = loadVideo();
var contentWidth = video.videoWidth;
var contentHeight = video.videoHeight;
var di = document.getElementById('frame');
var i = 0,j = 0;

function start(){
  // let video;
  // try {
  //   video = loadVideo(); // video属性をロード
  // } catch (e) {
  //   console.error(e);
  //   return;
  // }
  // video.currentTime = dateArr[i];
  video.currentTime = 2;
  console.log(i);
  console.log(dateArr[i])
}

// video属性のロード
async function loadVideo() {
  let video = document.getElementById('video')
  var intervalId = setInterval( function () {
	if ( video.readyState >= HTMLMediaElement.HAVE_METADATA ) {
    contentWidth = video.videoWidth;
    contentHeight = video.videoHeight;
    clearInterval( intervalId ) ;
	}}, 500 ) ;
  video.currentTime = 0;
  return video;
}

// canvasをdateArr.length個作る
function createCanvas(){
  //for(let i=0;i<dateArr.length;i++){
  di.insertAdjacentHTML('beforeend', '<canvas id=\"' + j +'\" width=\"'+contentWidth+'px\" height=\"'+contentHeight+'px\"></canvas>');
  console.log("createCanvas"+j+" , "+contentHeight);
  ++j;
}

function copyFrame() {
    let c = document.getElementById(i++);
    let ctx = c.getContext('2d');
    console.log(video.currentTime);
    ctx.drawImage(video, 0, 0);  // canvasに関数実行時の動画のフレームを描画
    ctx.beginPath();
    ctx.arc(77, 50, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "pink";
    ctx.fill();
}
