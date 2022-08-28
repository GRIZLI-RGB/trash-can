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





    // NODE [START] //



    // NODE [END] //





    // SPINNER [START] //

    // здесь храним всех родителей и детей панели справа
    let listItems = {
        1: 0
    }

    // по дефолту создаем спиннер #1
    $('.main__panel-item-range').spinner({
        min: 0,
        max: 100,
        stop: function(e) {
            $(this).change(changeSpinner(e));
        }
    });

    // функция добавления спиннера в правую панель
    function addSpinner(numberSpinner, numberParent, numberLevel) {

        $('.main__panel').append('<div class="main__panel-item"><p class="main__panel-item-text">Кол-во детей у #' + numberSpinner.toString() + ': </p><input class="main__panel-item-range" id="' + numberSpinner.toString() + '" ' + 'data-parent="' + numberParent.toString() + '" ' + 'data-level="' + numberLevel.toString() + '"' + '></div>');

        $('.main__panel-item-range').spinner({
                    min: 0,
                    max: 100,
                    stop: function(e, ui) {
                        $(this).change(changeSpinner(e));
                    }
                });

    }

    function changeSpinner(e) {

        let currentValue = $(e.target).spinner('value');
        let currentId = Number($(e.target).attr('id'));
        let currentParent = Number($(e.target).attr('data-parent'));
        let currentLevel = Number($(e.target).attr('data-level'));

        // если добавляем
        if ($(e.currentTarget).hasClass('ui-spinner-up')) {
            // добавляем спиннер
            addSpinner(Object.keys(listItems).length + 1, currentId,currentLevel + 1);
            // добавляем в listItems кол-во детей спиннера и сам спиннер
            listItems[$(e.target).attr('id')] = currentValue;
            listItems[(Object.keys(listItems).length) + 1] = 0;

            // console.log(`Создан новый ребенок с уровнем ${currentLevel + 1}, имеющий родителя ${currentId} под номером ${(Object.keys(listItems).length)}`);

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

    }

    // SPINNER [END] //





    // GRAPH DRAW [START] //

    const graph = $('.main__graph')[0];
    graph.width = 1200;
    graph.height = 650;
    const cGraph = graph.getContext('2d');

    let vertexes = {
        1: {1: []}
    }

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
        cGraph.clearRect(0, 0, 1200, 600);

        // собираем список кругов
        for (const key in vertexes) {
            let currentLevel = key;
            let currentParents = [];
            let currentY = 50 + (currentLevel * 100);

            for (const k in vertexes[key]) {
                currentParents.push(k);
            }

            currentParents.forEach((value) => {
                let parentX = vertexesCircle[value].x;
                let numberChilds = vertexes[currentLevel][value].length;
                if (vertexes[currentLevel][value].length != 0) {
                    vertexes[currentLevel][value].forEach((val, ind) => {
                        vertexesCircle[val] = new Circle(val, takeX(parentX, numberChilds, ind), currentY);
                    })
                }
            })

            vertexesCircle[1].draw();
        }

        // решаем проблему с дистанцией (столкновениями)
        // for (const key in vertexesCircle) {
        //     let circleX = vertexesCircle[Number(key)];
        //     let circleXNext = vertexesCircle[Number(key)+1];
        //     if(circleXNext != undefined) {
        //         let difference = Math.abs(circleXNext.x - circleX.x);
        //         if(difference < 100) {
        //             for(const k in vertexes) {
        //                 let arr = [];
        //                 for(const i in vertexes[k]) {
        //                     vertexes[k][i].forEach((value) => {
        //                         arr.push(value);
        //                     })
        //                 }
        //                 if(arr.includes(circleX.number) && arr.includes(circleXNext.number)) {
        //                     arr.forEach(element => {
        //                         if((vertexesCircle[Number(element) + 1]) && Math.abs(vertexesCircle[Number(element + 1)].x - vertexesCircle[Number(element)].x) < 100) {
        //                             vertexesCircle[element].x -= 50;
        //                             vertexesCircle[getParent(element)].x -= 50;
        //                         }
        //                     });
        //                 }
        //             }
        //         }
        //     }
        // }

        // добавляем стрелочки
        for(const key in vertexes) {
            for (const k in vertexes[key]) {
                vertexes[key][k].forEach(value => {
                    let parentX = vertexesCircle[k].x;
                    let parentY = vertexesCircle[k].y;
                    new Line(vertexesCircle[value].x, vertexesCircle[value].y - 30, parentX, parentY + 30).draw();
                })
            }
        }

        // выводим все собранные круги
        for (const key in vertexesCircle) {
            vertexesCircle[key].draw();
        }
    }

    main();

    // GRAPH DRAW [END] //





    $('.top__left-buttons-down-defaultGraph').click(function (e) {
        vertexes = json['defaultGraph'];
        main();
        e.preventDefault();
    });

});