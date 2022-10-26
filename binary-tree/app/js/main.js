import json from '../config.json' assert {type: 'json'};

let configPhoto = json['photo'];
$('.top__right-img').css('background-image', 'url(' + configPhoto + ')');
let configVertexes = json['defaultGraph'];
$('.top__left-buttons-down-defaultGraph').click(() => { 
    vertexes = configVertexes;
    buildVertexes();
    moveVertexes();
    clearCanvas();
    drawArrows();
    drawVertexes();
});

class Circle {
    constructor(number, x, y, color = '#B6D1D9', active = false) {
        this.number = number;
        this.x = x;
        this.y = y;
        this.color = color;
        this.active = active;
    }
    draw() {
        if(this.active) {
            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 43, 0, 2 * Math.PI);
            cGraph.fillStyle = '#2A88E1';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 40, 0, 2 * Math.PI);
            cGraph.fillStyle = '#FFF';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 37, 0, 2 * Math.PI);
            cGraph.fillStyle = '#2A88E1';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 34, 0, 2 * Math.PI);
            cGraph.fillStyle = '#FFF';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 30, 0, 2 * Math.PI);
            cGraph.fillStyle = '#2A88E1';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.font = '24px sans-serif';
            cGraph.fillStyle = '#000';
            cGraph.textAlign = 'center';
            cGraph.textBaseline = 'middle';
            cGraph.fillText(this.number, this.x, this.y);
        } else {
            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 30, 0, 2 * Math.PI);
            cGraph.strokeStyle = '#8A8A8A';
            cGraph.lineWidth = 3;
            cGraph.stroke();
            cGraph.fillStyle = this.color;
            cGraph.fill();

            cGraph.beginPath();
            cGraph.font = '24px sans-serif';
            cGraph.fillStyle = '#000';
            cGraph.textAlign = 'center';
            cGraph.textBaseline = 'middle';
            cGraph.fillText(this.number, this.x, this.y);
        }
    }
}

class Line {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
    draw() {
        cGraph.beginPath();
        cGraph.moveTo(this.startX, this.startY);
        cGraph.lineTo(this.endX, this.endY);
        cGraph.strokeStyle = "#908371";
        cGraph.lineWidth = '3';
        cGraph.stroke();
    }
}

class Curve {
    /**
     * 
     * @param {*} startX - Начальная координата X 
     * @param {*} startY Начальная координата Y 
     * @param {*} controlX Контрольная точка изгиба X
     * @param {*} controlY Контрольная точка изгиба Y
     * @param {*} endX Конечная координата X
     * @param {*} endY Конечная координата Y
     * @param {*} type Тип кривой: positive (большая зелёная), extra (пунктирная зелёная), negative (большая красная), neutral (нейтральная жёлтая)
     */
    constructor(startX, startY, controlX, controlY, endX, endY, type) {
        this.startX = startX;
        this.startY = startY;
        this.controlX = controlX;
        this.controlY = controlY;
        this.endX = endX;
        this.endY = endY;
        this.type = type;
    }
    draw() {
        cGraph.beginPath();
        cGraph.moveTo(this.startX, this.startY);
        cGraph.quadraticCurveTo(this.controlX, this.controlY, this.endX, this.endY);
        switch (this.type) {
            case 'positive':
                cGraph.strokeStyle = '#54A520'
                break;
            case 'negative':
                cGraph.strokeStyle = '#F83A3A'
                break;
            case 'neutral':
                cGraph.strokeStyle = '#FFCC00'
                break;
            case 'extra':
                cGraph.setLineDash([15, 5]);
                cGraph.strokeStyle = '#8AD554'
                break;
            default:
                break;
        }
        cGraph.lineWidth = '6';
        cGraph.stroke();
    }
}

const graph = $('.main__graph')[0];
const cGraph = graph.getContext('2d');

let vertexes = { 1: { 1: []} };
let vertexesCircle = { 1: new Circle(1, 600, 50) };

// Соберет все вершины и задаст им правильные координаты //
function buildVertexes() {
    function takeX(parentX, numberChilds, index) {
        let coords = [];
        for (let index = 0; index < numberChilds; index++) {
            coords.push(0);
        }
        if(numberChilds % 2 == 0) {
            let centerRight = (numberChilds / 2) - 1;
            let centerLeft = numberChilds / 2;
            coords[centerRight] = parentX - 50;
            coords[centerLeft] = parentX + 50;
            for (let index = 0; index < coords.length; index++) {
                if (index < centerRight) {
                    let coordsCenterRightMinus = centerRight - index;
                    coords[index] = coords[centerRight] - (100 * coordsCenterRightMinus);
                } 
                if (index > centerLeft) {
                    let coordsCenterLeftMinus = centerLeft - index;
                    coords[index] = coords[centerLeft] + (100 * Math.abs(coordsCenterLeftMinus));
                }
            }
        } else {
            let centerIndex = Math.floor(numberChilds / 2);
            coords[centerIndex] = parentX;
            for (let index = 0; index < coords.length; index++) {
                let coordsCenterMinus = centerIndex - index;
                if (coordsCenterMinus > 0) {
                    coords[index] = coords[centerIndex] - (100  * coordsCenterMinus);
                } else {
                    coords[index] = coords[centerIndex] + (100  * Math.abs(coordsCenterMinus));
                }
            }
        }
        return coords[index];
    }
    function takeY(level) {
        return (50 + (level * 100));
    }
    for(const level in vertexes) {
        let currentParents = [];
        for(const parent in vertexes[level]) {
            currentParents.push(parent);
        }
        currentParents.forEach(value => {
            let parentX = vertexesCircle[value].x;
            let numberChilds = vertexes[level][value].length;
            if(numberChilds != 0) {
                vertexes[level][value].forEach((val, ind) => {
                    vertexesCircle[val] = new Circle(val, takeX(parentX, numberChilds, ind), takeY(level));
                })
            }
        })
    }
}

// Отрисует линии между вершинами
function drawArrows() {
    for(const level in vertexes) {
        for(const parent in vertexes[level]) {
            vertexes[level][parent].forEach(value => {
                let parentX = vertexesCircle[parent].x;
                let parentY = vertexesCircle[parent].y;
                new Line(vertexesCircle[value].x, vertexesCircle[value].y - 30, parentX, parentY + 30).draw();
            })
        }
    }
}

// Отрисует все вершины
function drawVertexes() {
    for(const numberCircle in vertexesCircle) {
        vertexesCircle[numberCircle].draw();
    }
}

// Подвинет вершины, чтобы они не мешались друг другу
function moveVertexes() {
    function checkParent(numberElement) {
        let parentElement;
        for(const level in vertexes) {
            for(const parent in vertexes[level]) {
                vertexes[level][parent].forEach(value => {
                    if (Number(numberElement) == Number(value)) {
                        parentElement = parent;
                    }
                })
            }
        }
        return parentElement;
    }
    for (const level in vertexes) {
        let currentChilds = [];
        let taran = [];
        for (const parent in vertexes[level]) {
            vertexes[level][parent].forEach(value => {
                currentChilds.push(value);
            })
        }
        currentChilds.forEach((value, index) => {
            let currentX = vertexesCircle[value].x;
            if ((currentChilds.length - 1) != index) {
                let currentXNext = vertexesCircle[Number(value) + 1].x;
                if(Math.abs(currentX - currentXNext) < 100) {
                    taran.push(value);
                }
            }
        })
        if(taran.length > 0) {
            let currentElement = taran[0];
            let currentElementParent = checkParent(currentElement);
            if (vertexesCircle[currentElementParent].x <= 600) {
                vertexesCircle[currentElementParent].x -= 50;
                for(const level in vertexes) {
                    for(const parent in vertexes[level]) {
                        if(parent == currentElementParent) {
                            vertexes[level][parent].forEach(value => {
                                vertexesCircle[value].x -= 50;
                            })
                        }
                    }
                }
            } else {
                vertexesCircle[currentElementParent].x += 50;
                for(const level in vertexes) {
                    for(const parent in vertexes[level]) {
                        if(parent == currentElementParent) {
                            vertexes[level][parent].forEach(value => {
                                vertexesCircle[value].x += 50;
                            })
                        }
                    }
                }
            }
            moveVertexes();
        }
    }
}

// Полностью очистит канвас
function clearCanvas() {
    cGraph.clearRect(0, 0, graph.width, graph.height);
}

/////////////////////
// [START] SPINNER //
/////////////////////

// Хранилище родителей и количества их детей
let listItems = { 1: 0 }

// Создадим начальный спиннер для единицы
$('.main__panel-item-range').spinner({
    min: 0,
    max: 100,
    stop: function(e) {
        $(this).change(changeSpinner(e));
    }
});

// Добавление спиннера
function addSpinner(numberSpinner, numberParent, numberLevel) {
    $('.main__panel').append('<div class="main__panel-item"><p class="main__panel-item-text">Кол-во детей у #' + numberSpinner.toString() + ': </p><input disabled class="main__panel-item-range" id="' + numberSpinner.toString() + '" ' + 'data-parent="' + numberParent.toString() + '" ' + 'data-level="' + numberLevel.toString() + '"' + '></div>');

    $('.main__panel-item-range').spinner({
        min: 0,
        max: 100,
        stop: function(e) {
            $(this).change(changeSpinner(e));
        }
    });
}

// Реакция на добавление/убавление у спиннера
function changeSpinner(e) {

    let currentValue = $(e.target).spinner('value');
    let currentId = Number($(e.target).attr('id'));
    let currentLevel = Number($(e.target).attr('data-level'));

    // Обработка добавления
    if ($(e.currentTarget).hasClass('ui-spinner-up')) {
        addSpinner(Object.keys(listItems).length + 1, currentId,currentLevel + 1);
        listItems[$(e.target).attr('id')] = currentValue;
        listItems[(Object.keys(listItems).length) + 1] = 0;
        if((currentLevel + 1) in vertexes) {
            if(currentId in vertexes[currentLevel + 1]) {
                vertexes[currentLevel + 1][currentId].push(Object.keys(listItems).length);
            } else {
                vertexes[currentLevel + 1][currentId] = [Object.keys(listItems).length];
            }
        } else {
            vertexes[currentLevel + 1] = {[currentId]: [Object.keys(listItems).length]};
        }
        buildVertexes();
        moveVertexes();
        clearCanvas();
        drawArrows();
        drawVertexes();
    } 

    // Обработка убавления
    else {
        if (Object.keys(listItems).length > 1  && listItems[currentId] > 0) {
            delete listItems[Object.keys(listItems).length];
            listItems[$(e.target).attr('id')] = currentValue;
            $('.main__panel-item:last').remove();
            delete vertexesCircle[(vertexes[currentLevel + 1][currentId].pop())];
        }
        buildVertexes();
        moveVertexes();
        clearCanvas();
        drawArrows();
        drawVertexes();
    }
}

/////////////////////
//  [END] SPINNER  //
/////////////////////



/////////////////////
//  [START] NODE   //
/////////////////////

// Хранение значений нод
let nodeValues = {'u': [], 'v': []};

// Node U
$('#node-u').on('input', function() {
    if($(this).val() in vertexesCircle) {
        vertexesCircle[nodeValues['u'][0]] = new Circle(nodeValues['u'][0], nodeValues['u'][1], nodeValues['u'][2]);
        let cX = vertexesCircle[$(this).val()].x;
        let cY = vertexesCircle[$(this).val()].y;
        vertexesCircle[$(this).val()] = new Circle($(this).val(), cX, cY, '#000', true);
        nodeValues['u'][0] = $(this).val();
        nodeValues['u'][1] = cX;
        nodeValues['u'][2] = cY;
        clearCanvas();
        drawArrows();
        drawVertexes();
    } else {
        vertexesCircle[nodeValues['u'][0]] = new Circle(nodeValues['u'][0], nodeValues['u'][1], nodeValues['u'][2]);
        clearCanvas();
        drawArrows();
        drawVertexes();
    }
});

// Node V
$('#node-v').on('input', function() {
    if($(this).val() in vertexesCircle) {
        vertexesCircle[nodeValues['v'][0]] = new Circle(nodeValues['v'][0], nodeValues['v'][1], nodeValues['v'][2]);
        let cX = vertexesCircle[$(this).val()].x;
        let cY = vertexesCircle[$(this).val()].y;
        vertexesCircle[$(this).val()] = new Circle($(this).val(), cX, cY, '#000', true);
        nodeValues['v'][0] = $(this).val();
        nodeValues['v'][1] = cX;
        nodeValues['v'][2] = cY;
        clearCanvas();
        drawArrows();
        drawVertexes();
    } else {
        vertexesCircle[nodeValues['v'][0]] = new Circle(nodeValues['v'][0], nodeValues['v'][1], nodeValues['v'][2]);
        clearCanvas();
        drawArrows();
        drawVertexes();
    }
});

/////////////////////
//   [END] NODE    //
/////////////////////



/////////////////////////////
//  [START] PREPROCESSING  //
/////////////////////////////

// Обработка клика по кнопке запуска препроцессинга
$('.top__left-buttons-up-preprocessing').click(function () { 
    
});

/////////////////////////////
//   [END] PREPROCESSING   //
/////////////////////////////



/////////////////////////////
//   [START] FINDING LCA   //
/////////////////////////////

// Обработка клика по кнопке запуска LCA-поиска
$('.top__left-buttons-up-lca').click(function () { 
    // 1. Проверяем ноды, подписываем их буквами, выводим логи

    // Подпись нод
    let numberU = nodeValues['u'][0];
    let numberV = nodeValues['v'][0];

    cGraph.beginPath();
    cGraph.font = '40px sans-serif';
    cGraph.fillStyle = '#000';
    cGraph.textAlign = 'center';
    cGraph.textBaseline = 'middle';
    cGraph.fillText('u', vertexesCircle[numberU].x + 53, vertexesCircle[numberU].y);

    cGraph.beginPath();
    cGraph.font = '40px sans-serif';
    cGraph.fillStyle = '#000';
    cGraph.textAlign = 'center';
    cGraph.textBaseline = 'middle';
    cGraph.fillText('v', vertexesCircle[numberV].x + 53, vertexesCircle[numberV].y);

    // Проверка на глубину
    if(vertexesCircle[numberU].y < vertexesCircle[numberV].y) {
        // Меняем u и v местами
        let prom1 = nodeValues['u'];
        let prom2 = nodeValues['v'];
        nodeValues['u'] = prom2;
        nodeValues['v'] = prom1;
    }

    // 2. Поднимаем на нужную глубину ноды
    // 3. Ищем общего предка
});

/////////////////////////////
//    [END] FINDING LCA    //
/////////////////////////////



/* 
    Когда страница стартует, делаем следующие действия:
*/

// 1. Рисуем линии соединения вершин
drawArrows();

// 2. Рисуем вершины
drawVertexes();