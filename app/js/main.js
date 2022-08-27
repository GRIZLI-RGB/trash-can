import json from '../config.json' assert {type: 'json'};

$(function () {

    setTimeout(() => {
        $('.main__logs-text').text('Сайт успешно запущен!');
    }, 3500)

    $('.top__right-img').css('background-image', 'url(' + json['photo'] + ')');

    $('.top__left-inputs-item-input').on('input', function (e) { 
        let input = Number($(this).val())
        if((input > 0) && (input < 13)) {
            let num = Number(input);
            let x = vertexes[num].x;
            let y = vertexes[num].y;
            vertexes[Number(input)] = new activeCircle(num, x, y);
            vertexes[Number(input)].draw();
        } else {
            main();
        }
    });

    $('.main__panel-item-range').spinner({
        min: 0,
        max: 100,
        stop: function(e, ui) {
            $(this).change(changeSpinner(e));
        }
    });

    let listItems = {
        1: 0
    }

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
    
    class activeCircle {
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

    function changeSpinner(e) {
        let currentValue = $(e.target).spinner('value');
        if ($(e.currentTarget).attr('class') == 'ui-button ui-widget ui-spinner-button ui-spinner-up ui-corner-tr ui-button-icon-only') {
            addSpinner((Object.keys(listItems).length) + 1);
            listItems[$(e.target).attr('id')] = currentValue;
            listItems[(Object.keys(listItems).length) + 1] = 0;
        } else {
            delete listItems[Object.keys(listItems).length];
            $('.main__panel-item:last').remove();
        }
    }

    function addSpinner(number) {
        $('.main__panel').append('<div class="main__panel-item"><p class="main__panel-item-text">Кол-во детей у #' + number.toString() + ': </p><input class="main__panel-item-range" id="' + number.toString() + '"></div>');
        $('.main__panel-item-range').spinner({
            min: 0,
            max: 100,
            stop: function(e, ui) {
                $(this).change(changeSpinner(e));
            }
        });
    }

    const graph = $('.main__graph')[0];
    graph.width = 1200;
    graph.height = 650;
    const cGraph = graph.getContext('2d');

    // GRAPH DRAW START //

    // let vertexesChilds = {
    //     1: [2, 3, 4, 5, 6], // у 2, 3, 4 - 2 (1) уровень
    //     2: [7, 8, 9], // у 7,8,9 - 3 (2) уровень
    //     3: [10], // у 10 - 3 (2) уровень
    //     5: [11, 12, 13] // у 11,12,13 - 3 (2) уровень
    // }

    // let vertexes = {
    //     1: new Circle(1, 600, 50)
    // }

    // function main() {
    //     for (const key in vertexesChilds) {
    //         vertexes[1].draw();
    //         let currentY = 50 + (key * 100);
    //         let parentX = vertexes[key].getX();
    //         vertexesChilds[key].forEach((value, ind) => {
    //             if(vertexesChilds[key].length > 2 && key != 1) {
    //                 vertexes[key].x -= 100;
    //             }
    //             vertexes[value] = new Circle(value, giveCoordX(parentX, vertexesChilds[key].length, ind), currentY);
    //             vertexes[value].draw();
    //         });
    //     }
    // }

    let vertexes = {1: {1: [2, 3, 4]},
                    2: {2: [], 3: [5, 6], 4: []},
                    3: {5: [], 6: [7, 8, 9, 10]}}

    let vertexesCircle = {
        1: new Circle(1, 600, 50)
    }

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

    function main() {
        cGraph.clearRect(0, 0, graph.width, graph.height);

        // собираем список кругов
        for (const key in vertexes) {
            let currentLevel = key;
            let currentParents = [];
            let currentY = 50 + (currentLevel * 100);

            for (const k in vertexes[key]) {
                currentParents.push(k);
            }

            console.log(`\nТекущий уровень: ${currentLevel}\nРодители на этом уровне: ${currentParents}`);

            currentParents.forEach((value) => {
                vertexes[currentLevel][value].length == 0 ? console.log(`У родителя ${value} детей нет`) : console.log(`У родителя ${value} есть дети ${vertexes[currentLevel][value]}`);
                let parentX = vertexesCircle[value].x;
                let numberChilds = vertexes[currentLevel][value].length;
                if (vertexes[currentLevel][value].length != 0) {
                    vertexes[currentLevel][value].forEach((val, ind) => {
                        // val - выдает ребенка (2, 3, 4, 5, 6, 7, 8)
                        vertexesCircle[val] = new Circle(val, takeX(parentX, numberChilds, ind), currentY);
                    })
                }
            })

            vertexesCircle[1].draw();

            console.log(vertexesCircle);
        }

        // выводим все собранные круги
        for (const key in vertexesCircle) {
            vertexesCircle[key].draw();
        }

        // добавляем стрелочки
        for(const key in vertexes) {
            for (const k in vertexes[key]) {
                vertexes[key][k].forEach(value => {
                    let parentX = vertexesCircle[k].x;
                    let parentY = vertexesCircle[k].y;
                    new Line(vertexesCircle[value].x, vertexesCircle[value].y - 30, parentX, parentY + 30).draw();
                    console.log(`Значение ${value} с родителем ${k}`);
                })
            }
        }

    }

    main();

    // GRAPH DRAW END //

});