import json from '../config.json' assert {type: 'json'};

$(function () {

    // SITE [START] //

    /* 
        Забираем фотку из config.json и устанавливаем её на нужное место
    */
    $('.top__right-img').css('background-image', 'url(' + json['photo'] + ')');

    /* 
        Забираем граф из config.json и устанавливаем его на нужное место
    */
    $('.top__left-buttons-down-defaultGraph').click(function (e) {
        vertexes = json['defaultGraph'];
        main();
        e.preventDefault();
    });

    /* 
        Класс для создания обычной вершины
    */
    class Circle {
        constructor(number, x, y) {
            this.number = number;
            this.x = x;
            this.y = y;
        }
        draw() {
            cGraph.beginPath();
            cGraph.arc(this.x, this.y, 30, 0, 2 * Math.PI);
            cGraph.strokeStyle = '#8A8A8A';
            cGraph.lineWidth = 3;
            cGraph.stroke();
            cGraph.fillStyle = '#B6D1D9';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.font = '24px sans-serif';
            cGraph.fillStyle = '#000';
            cGraph.textAlign = 'center';
            cGraph.textBaseline = 'middle';
            cGraph.fillText(this.number, this.x, this.y);
        }
    }

    /* 
        Класс для создания выбранной вершины
    */
    class activeCircle {
        constructor(number, x, y) {
            this.number = number;
            this.x = x;
            this.y = y;
        }
        draw() {
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
            cGraph.strokeStyle = '#8A8A8A';
            cGraph.lineWidth = 3;
            cGraph.stroke();
            cGraph.fillStyle = '#2A88E1';
            cGraph.fill();

            cGraph.beginPath();
            cGraph.font = '24px sans-serif';
            cGraph.fillStyle = '#000';
            cGraph.textAlign = 'center';
            cGraph.textBaseline = 'middle';
            cGraph.fillText(this.number, this.x, this.y);
        }
    }

    /* 
        Класс для создания линии соединения вершин
    */
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

    // SITE [END] //





    // NODE [START] //

    /*
        Значения нод
    */
    let nodeValues = {
        'u': [],
        'v': []
    }

    /*
        Набор текста в Node U
    */
    $('#node-u').on('input', function() {
        if($(this).val() in vertexesCircle) {
            let cX = vertexesCircle[$(this).val()].x;
            let cY = vertexesCircle[$(this).val()].y;
            vertexesCircle[$(this).val()] = new activeCircle($(this).val(), cX, cY);
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

    /*
        Набор текста в Node V
    */
    $('#node-v').on('input', function() {
        if($(this).val() in vertexesCircle) {
            let cX = vertexesCircle[$(this).val()].x;
            let cY = vertexesCircle[$(this).val()].y;
            vertexesCircle[$(this).val()] = new activeCircle($(this).val(), cX, cY);
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

    // NODE [END] //





    // SPINNER [START] //

    /*
        Хранилище всех детей и родителей из панели справа
    */
    let listItems = {
        1: 0
    }

    /*
        Создание дефолтного спиннера #1
    */
    $('.main__panel-item-range').spinner({
        min: 0,
        max: 100,
        stop: function(e) {
            $(this).change(changeSpinner(e));
        }
    });

    /*
        Добавление спинера
    */
    function addSpinner(numberSpinner, numberParent, numberLevel) {

        $('.main__panel').append('<div class="main__panel-item"><p class="main__panel-item-text">Кол-во детей у #' + numberSpinner.toString() + ': </p><input disabled class="main__panel-item-range" id="' + numberSpinner.toString() + '" ' + 'data-parent="' + numberParent.toString() + '" ' + 'data-level="' + numberLevel.toString() + '"' + '></div>');

        $('.main__panel-item-range').spinner({
                    min: 0,
                    max: 100,
                    stop: function(e, ui) {
                        $(this).change(changeSpinner(e));
                    }
                });

    }

    /*
        Отслеживание и обработка добавления/убавления детей в правой панели
    */
    function changeSpinner(e) {

        let currentValue = $(e.target).spinner('value');
        let currentId = Number($(e.target).attr('id'));
        let currentLevel = Number($(e.target).attr('data-level'));

        // если добавляем
        if ($(e.currentTarget).hasClass('ui-spinner-up')) {

            // добавляем спиннер
            addSpinner(Object.keys(listItems).length + 1, currentId,currentLevel + 1);

            // добавляем в listItems кол-во детей спиннера и сам спиннер
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

            main();
        } 
        // если убавляем
        else {
            // если в элементов больше, чем 1 и у него есть дети
            if (Object.keys(listItems).length > 1  && listItems[currentId] > 0) {
                delete listItems[Object.keys(listItems).length];
                listItems[$(e.target).attr('id')] = currentValue;
                $('.main__panel-item:last').remove();

                // console.log(`Удален ребенок на уровне ${currentLevel + 1}, имеющий родителя ${currentId} под номером ${(Object.keys(listItems).length)}`);

                delete vertexesCircle[(vertexes[currentLevel + 1][currentId].pop())];

                main();
            }
        }
        moveVertexes();
    }

    // SPINNER [END] //





    // GRAPH DRAW [START] //

    /*
        Создаем канвас размером 1200 на 650 пикселей в 2D-формате
    */
    const graph = $('.main__graph')[0];
    graph.width = 1200;
    graph.height = 650;
    const cGraph = graph.getContext('2d');

    /*
        Иерархия всех вершин
    */
    let vertexes = {
        1: {1: []}
    }

    /*
        Все вершины с их параметрами
    */
    let vertexesCircle = {
        1: new Circle(1, 600, 50)
    }

    // function checkEqualParents(firstElement, secondElement) {
    //     let firstElementNumber = firstElement.number;
    //     let secondElementNumber = secondElement.number;
    //     if(firstElementNumber != secondElementNumber) {
    //         for (const level in vertexes) {
    //             let i = 0;
    //             for (const parent in vertexes[level]) {
    //                 if(firstElementNumber in vertexes[level][parent]) {
    //                     i += 1;
    //                 }
    //                 if(secondElementNumber in vertexes[level][parent]) {
    //                     i += 1
    //                 }
    //             }
    //             if(i == 2) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    /*
        Функция, двигающая вершины, чтобы они не сливались
    */
    function moveVertexes() {
        // for(const numberCircleOne in vertexesCircle) {
        //     for(const numberCircleTwo in vertexesCircle) {
        //         let firstElement = vertexesCircle[numberCircleOne];
        //         let secondElement = vertexesCircle[numberCircleTwo];
        //         let difference = Math.abs(firstElement.x - secondElement.x);
        //         if(difference < 100 && checkEqualParents(firstElement, secondElement)) {
        //             console.log('Пизда');
        //             console.log(vertexes, firstElementNumber, secondElementNumber);
        //         }
        //     }
        // }
    }

    /*
        Функция полной очистки канваса
    */
    function clearCanvas() {
        cGraph.clearRect(0, 0, graph.width, graph.height);
    }

    /*
        Функция получения координаты X по номеру родителя
    */
    function takeX(parentX, numberChilds, ind) {
            let coords = [];
            for (let index = 0; index < numberChilds; index++) {
                coords.push(0);
            }
            if (numberChilds % 2 == 0) {
                // четное количество детей
                let centerRight = (numberChilds / 2) - 1;
                let centerLeft = numberChilds / 2;
                coords[centerRight] = parentX - 50;
                coords[centerLeft] = parentX + 50;
                for (let index = 0; index < coords.length; index++) {
                    if (index < centerRight) {
                        // если слева
                        let coordsCenterRightMinus = centerRight - index;
                        coords[index] = coords[centerRight] - (100 * coordsCenterRightMinus);
                    } 
                    if (index > centerLeft) {
                        // // если справа
                        let coordsCenterLeftMinus = centerLeft - index;
                        coords[index] = coords[centerLeft] + (100 * Math.abs(coordsCenterLeftMinus));
                    }
                }
            } else {
                // нечетное количество детей
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
            return coords[ind];
    }

    /*
        Функция получения координаты X по номеру родителя
    */
    function takeY(currentLevel) {
        return (50 + (currentLevel * 100));
    }

    /*
        Функция сборки координат вершин
    */
    function buildVertexes() {
        for(const level in vertexes) {
            let currentLevel = level;
            let currentParents = [];
            for(const parent in vertexes[level]) {
                currentParents.push(parent);
            }
            currentParents.forEach(value => {
                let parentX = vertexesCircle[value].x;
                let numberChilds = vertexes[currentLevel][value].length;
                if(numberChilds != 0) {
                    vertexes[currentLevel][value].forEach((val, ind) => {
                        vertexesCircle[val] = new Circle(val, takeX(parentX, numberChilds, ind), takeY(currentLevel));
                    })
                }
            })
        }
    }

    /*
        Функция отрисовки всех вершин из vertexesCircle
    */
    function drawVertexes() {
        for (const numberCircle in vertexesCircle) {
            vertexesCircle[numberCircle].draw();
        }
    }

    /*
        Функция отрисовки всех стрелочек-соединялок
    */
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

    /*
        Функция отрисовки 1-го кадра
    */
    function main() {

        /*
            Очищаем канвас
        */
        clearCanvas();

        /*
            Собираем объект vertexesCircle на основе vertexes
        */
        buildVertexes();

        /*
            Отрисовываем стрелочки
        */
        drawArrows();

        /*
            Отрисовываем вершины
        */
        drawVertexes();

    }

    main();

    // GRAPH DRAW [END] //

});