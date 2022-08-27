var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

drawCoordinates(); // 축 초기화

// x, y축을 그리는 함수
function drawCoordinates() {
    ctx.setTransform(1, 0, 0, -1, 250, 250); // 선형변환 사용, 기본값
    // 축 스타일: 검은색, 굵기 1px
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-250, 0);
    ctx.lineTo(250, 0);
    ctx.moveTo(0, -250);
    ctx.lineTo(0, 250);
    ctx.stroke();
}

function drawLinearFunction() {
    ctx.clearRect(-250, -250, 500, 500); // 화면 초기화
    drawCoordinates();

    a = Number(document.querySelector("#linear-coff").value);
    b = Number(document.querySelector("#linear-const").value);
    
    // 함수의 그래프 스타일 (빨간색)
    ctx.strokeStyle = "red";

    // 배율 설정
    pointsMax = Math.max(Math.abs(-b/a), Math.abs(b));
    magn = (a == 0) ? 50 / Math.abs(b) : 50 / pointsMax;
    
    /* 해설
        Math.max(Math.abs(-b/a, b)): x, y절편의 절댓값 중 큰 값
        (상수) / ANS: 상수는 절편의 좌푯값을 의미, 클수록 배율이 커짐
    */

    ctx.lineWidth = 3 / magn; // 그래프 굵기 균등화
    ctx.setTransform(magn, 0, 0, -magn, 250, 250); // 배율 조정
    
    ctx.beginPath();
    ctx.moveTo(-250, a * -250 + b); // 그래프의 시작점
    for (let x=-250; x<=250; x++) {
        ctx.lineTo(x, a * x + b);
    }
    ctx.stroke();

    console.clear();
    console.log(`x절편: ${-b/a}`);
    console.log(`y절편: ${b}`);
}

function drawQuadraticFunction() {
    ctx.clearRect(-250, -250, 500, 500); // 화면 초기화
    drawCoordinates();

    a = Number(document.querySelector("#quadratic-coff2").value);
    b = Number(document.querySelector("#quadratic-coff1").value);
    c = Number(document.querySelector("#quadratic-const").value);

    // 주요 값 설정
    D = b**2 - 4*a*c;
    if (D > 0) {
        root = [(-b - Math.sqrt(D)) / (2*a), (-b + Math.sqrt(D)) / (2*a)];
    } else if (D == 0) {
        root = [-b / (2*a)];
    } else if (D < 0) {
        root = [];
    }
    vertex = [-b / (2*a), -D / (4*a)];
    points = [...root, ...vertex, c]; // c는 y절편

    
    ctx.strokeStyle = "red";
    
    // 배율 설정
    pointsMax = Math.max(
        ...points.map(x => Math.abs(x))
        );
    magn = (pointsMax == 0) ? 150 : (150 / pointsMax); // ax^2 꼴 조정
        
    xAxis = vertex[0];
    if (xAxis == 0) {
        if (pointsMax == 0) {
            graphRange = [-Math.sqrt(250/a**2), Math.sqrt(250/a**2)];
        } else {
            graphRange = [-pointsMax/0.6, pointsMax/0.6];
        }
    } else if (xAxis < 0) {
        graphRange = [2*xAxis - pointsMax/0.6, pointsMax/0.6];
    } else if (xAxis > 0) {
        graphRange = [-pointsMax/0.6, pointsMax/0.6+2*xAxis];
    }

    ctx.lineWidth = 3 / magn; // 그래프 굵기 균등화
    ctx.setTransform(magn, 0, 0, -magn, 250, 250); // 배율 조정
    
    ctx.beginPath();
    ctx.moveTo(graphRange[0], getValue(graphRange[0]))
    ctx.quadraticCurveTo(
        xAxis, 2*vertex[1]-getValue(graphRange[0]),
        graphRange[1], getValue(graphRange[1])
    );
    ctx.stroke();

    console.clear();
    console.log(
        graphRange[0], getValue(graphRange[0]),
        xAxis, getValue(xAxis),
        graphRange[1], getValue(graphRange[1])
    )
    console.log(`판별식의 값: ${D}`);
    console.log(`근: ${root.length == 0 ? "없음" : root.map(x => x.toFixed(3)).join(", ")}`);
    console.log(`꼭짓점: (${vertex.map(x => x.toFixed(3)).join(", ")})`);
    console.log(`y절편: ${c}`);
}

function main() {
    switch (degree) {
        case 1:
            drawLinearFunction();
            break;
        case 2:
            drawQuadraticFunction();
            break;
    }
}

function select(degree) {
    switch (degree) {
        case "linear":
            document.querySelector("#linear-input").style.display = "block";
            document.querySelector("#quadratic-input").style.display = "none";
            break;
        case "quadratic":
            document.querySelector("#linear-input").style.display = "none";
            document.querySelector("#quadratic-input").style.display = "block";
            break;
    }
}

function getValue(x) {
    return a * x ** 2 + b * x + c
} 
