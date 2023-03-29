const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
// Phương thức HTMLCanvasElement.getContext () trả về ngữ cảnh bản vẽ trên canvas, 
// "2d", dẫn đến việc tạo đối tượng CanvasRenderingContext2D đại diện cho ngữ cảnh kết xuất hai chiều.
ctx = canvas.getContext("2d");
// global variables with default value
// // biến toàn cục có giá trị mặc định
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";
const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    // đặt toàn bộ nền canvas thành màu trắng, vì vậy nền img đã tải xuống sẽ có màu trắng
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
    // thiết lập kiểu tô trở lại Màu đã chọn, nó sẽ là màu của bàn chải
}
window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    // thiết lập chiều rộng / chiều cao canvas .. offsetwidth / height trả về chiều rộng / chiều cao có thể xem của một phần tử
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});


const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    // nếu fillColor không được chọn, hãy vẽ hình chữ nhật với đường viền khác vẽ hình chữ nhật với nền
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        // tạo vòng tròn theo con trỏ chuột
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle // tạo đường dẫn mới để vẽ đường tròn
    // getting radius for circle according to the mouse pointer
    // lấy bán kính cho vòng tròn theo con trỏ chuột
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer // tạo vòng tròn theo con trỏ chuột
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle //nếu fillColor được chọn, hãy điền vào vòng tròn khác, hãy vẽ vòng tròn viền
}
const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle  // tạo đường dẫn mới để vẽ đường tròn
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer  // di chuyển tam giác sang con trỏ chuột
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer  // tạo dòng đầu tiên theo con trỏ chuột
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle  // tạo đường đáy của tam giác
    ctx.closePath(); // closing path of a triangle so the third line draw automatically  // đóng đường dẫn của một tam giác để dòng thứ ba tự động vẽ
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border  // nếu fillColor được chọn, hãy điền vào tam giác khác vẽ đường viền
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value // chuyển vị trí mouseX hiện tại thành giá trị prevMouseX
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value // chuyển vị trí mouseY hiện tại thành giá trị prevMouseY
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width // chuyển brushSize làm chiều rộng dòng
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style  // chuyển Màu được chọn làm kiểu tô màu
    // copying canvas data & passing as snapshot value.. this avoids dragging the image  // sao chép dữ liệu canvas và chuyển dưới dạng giá trị ảnh chụp nhanh .. điều này tránh kéo hình ảnh
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here // nếu isDrawing là false thì trả về từ đây
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas  // thêm dữ liệu canvas đã sao chép vào canvas này
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white  // nếu công cụ được chọn là tẩy thì đặt strokeStyle thành màu trắng
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        // để sơn màu trắng cho nội dung canvas hiện có, khác hãy đặt màu nét viền thành màu đã chọn
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer  // tạo dòng theo con trỏ chuột
        ctx.stroke(); // drawing/filling line with color  // vẽ tô màu
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option  // thêm sự kiện nhấp chuột vào tất cả tùy chọn công cụ
        // removing active class from the previous option and adding on current clicked option  // xóa lớp đang hoạt động khỏi tùy chọn trước đó và thêm vào tùy chọn được nhấp hiện tại
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize // chuyển giá trị thanh trượt dưới dạng brushSize
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button  // thêm sự kiện nhấp chuột vào nút tất cả màu
        // removing selected class from the previous option and adding on current clicked option
        // xóa lớp đã chọn khỏi tùy chọn trước đó và thêm vào tùy chọn được nhấp hiện tại
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        // chuyển màu nền btn đã chọn làm giá trị Màu được chọn
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    // chuyển giá trị màu đã chọn từ bộ chọn màu sang nền btn màu cuối cùng
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});
saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);