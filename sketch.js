let handPose;
let video;
let hands = [];
let bubbles = [];
let lifespan = 1000; // bubbles last 1 second
let colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#E964FF"]; // rainbow for fingers

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handPose.detectStart(video, gotHands);
  background(255);
}

function draw() {
  tint(255, 80);
  image(video, 0, 0, width, height);

  let now = millis();

  // draw and update bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];

    // remove old bubbles
    if (now - b.time > lifespan) {
      bubbles.splice(i, 1);
      continue;
    }

    // bubble float animation
    b.y -= 0.5; // float upward
    b.x += random(-0.5, 0.5); // slight wobble

    // draw bubble
    noStroke();
    fill(b.color + "55"); // transparent
    ellipse(b.x, b.y, b.size);

    // draw highlight
    fill(255, 200);
    ellipse(b.x - b.size * 0.2, b.y - b.size * 0.2, b.size * 0.3);
  }

  // add new bubbles for all fingertips
  let fingertipKeypoints = [4, 8, 12, 16, 20]; // thumb to pinky
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < fingertipKeypoints.length; j++) {
      let kp = hand.keypoints[fingertipKeypoints[j]];
      if (kp) {
        let size = random(10, 20);
        bubbles.push({
          x: kp.x,
          y: kp.y,
          size: size,
          color: colors[j % colors.length], // rainbow per finger
          time: millis()
        });
      }
    }
  }
}

function gotHands(results) {
  hands = results;
}
