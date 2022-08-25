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
        getX() {
            return this.x;
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

    function giveCoordX(parentX, childsNumber, ind) {
        let arr = []
        for (let index = 0; index < childsNumber; index++) {
            arr[index] = 0;
        }
        let arrCenter = Math.floor(childsNumber / 2)
        arr[arrCenter] = parentX;
        for (let index = 0; index < arr.length; index++) {
            let arrCenterMinus = arrCenter - index;
            if(arrCenterMinus > 0) {
                arr[index] = arr[arrCenter] - (100 * arrCenterMinus)
            } else {
                arr[index] = arr[arrCenter] + (100 * Math.abs(arrCenterMinus))
            }
        }
        return arr[ind]
    }

    const graph = $('.main__graph')[0];
    graph.width = 1200;
    graph.height = 650;
    const cGraph = graph.getContext('2d');

    // GRAPH DRAW START //

    let vertexesChilds = {
        1: [2, 3, 4, 5, 6], // у 2, 3, 4 - 2 (1) уровень
        2: [7, 8, 9], // у 7,8,9 - 3 (2) уровень
        3: [10], // у 10 - 3 (2) уровень
        5: [11, 12, 13] // у 11,12,13 - 3 (2) уровень
    }

    let vertexes = {
        1: new Circle(1, 600, 50)
    }

    function main() {
        for (const key in vertexesChilds) {
            vertexes[1].draw();
            let currentY = 50 + (key * 100);
            let parentX = vertexes[key].getX();
            vertexesChilds[key].forEach((value, ind) => {
                if(vertexesChilds[key].length > 2 && key != 1) {
                    vertexes[key].x -= 100;
                }
                vertexes[value] = new Circle(value, giveCoordX(parentX, vertexesChilds[key].length, ind), currentY);
                vertexes[value].draw();
            });
        }
    }

    main();

    // GRAPH DRAW END //

});