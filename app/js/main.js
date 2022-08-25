import json from '../config.json' assert {type: 'json'};

$(function () {

    $('.top__right-img').css('background-image', 'url(' + json['photo'] + ')');
    $('.main__panel-item-range').spinner({
        spin: (e, ui) => {
            if (ui.value == -1) {
                $(this).spinner('value', 0);
            }
        }
    });

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

    //////////////////////////////////////////////////////////////////////

    const graph = $('.main__graph')[0];
    graph.width = 1200;
    graph.height = 650;
    
    const cGraph = graph.getContext('2d');

    let vertexesChilds = {
        1: [2, 3, 4], // у 2, 3, 4 - 2 уровень
        2: [5], // у 5 - 3 уровень
        3: [6] // у 6 - 3 уровень
    }

    let vertexesLevel = {
        1: 1
    }

    for (const key in vertexesChilds) {
        vertexesChilds[key].forEach((value, index) => {
            if (key == 1) {
                if (typeof vertexesLevel[2] == 'object') {
                    vertexesLevel[2].push(value)
                } else {
                    vertexesLevel[2] = [value]
                }
            } else {
                
            }
        })
    }

    console.log(vertexesLevel);

    let vertexes = {
        1: new Circle(1, 600, 50)
    }

    for (const key in vertexesChilds) {
        vertexes[1].draw();
        let currentY = 50 + (key * 100);
        let parentX = vertexes[key].getX();
        vertexesChilds[key].forEach((value, ind) => {
            vertexes[value] = new Circle(value, giveCoordX(parentX, vertexesChilds[key].length, ind), currentY);
            vertexes[value].draw();
        });
    }

    //////////////////////////////////////////////////////////////////////

});