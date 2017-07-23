calcData = '{';

document.getElementById("shapes").onchange = function() {
    var shape = document.getElementById("shapes");
    switch(shape.selectedIndex) {
        case 1:
            document.getElementsByClassName("c-params")[0].classList.remove("shows");
            document.getElementsByClassName("p-params")[0].classList.add("shows");
            document.getElementsByClassName("required-params")[0].classList.add("shows");
            break;
        case 2:
            document.getElementsByClassName("p-params")[0].classList.remove("shows");
            document.getElementsByClassName("c-params")[0].classList.add("shows");
            document.getElementsByClassName("required-params")[0].classList.add("shows");
            break;
    }
}

document.getElementById("report").onclick = function() {
    var fields = document.getElementsByClassName("data");
    var valids = 0;
    var userData = '{"volume" : "' + document.getElementsByClassName("volume")[0].innerText + '",';
    for (var i = 0; i < fields.length; i++) {
        var value = fields[i].value;
        switch (fields[i].name) {
            case "fio":
                var fio = /^[a-zA-Zа-яА-Я\ -]+$/;
                if (value.length > 5 && value != "" && fio.test(value)) {
                    userData += '"' + fields[i].name + '" : "' + fields[i].value + '",';
                    fields[i].classList.remove("error");
                    document.getElementsByClassName(fields[i].name + '-status')[0].innerText = "";
                    valids++;
                }
                else {
                    document.getElementsByClassName(fields[i].name + '-status')[0].innerText = "Допустимы только буквы";
                    fields[i].classList.add("error");
                    valids--;
                }
                break;
            case "phone":
                var phone = /^([0-9\+()-])/;
                if (value.length <= 12 && value.length >= 6 && value != "" && phone.test(value)) {
                    userData += '"' + fields[i].name + '" : "' + fields[i].value + '",';
                    fields[i].classList.remove("error");
                    document.getElementsByClassName(fields[i].name + '-status')[0].innerText = "";
                    valids++;
                }
                else {
                    document.getElementsByClassName(fields[i].name + '-status')[0].innerText = "Размер номера от 6 до 12 символов";
                    fields[i].classList.add("error");
                    valids--;
                }
                break;
            case "email":
                var email = /@/;
                if (value != "" && email.test(value)) {
                    userData += '"' + fields[i].name + '" : "' + fields[i].value + '",';
                    fields[i].classList.remove("error");
                    document.getElementsByClassName(fields[i].name + '-status')[0].innerText = "";
                    valids++;
                }
                else {
                    document.getElementsByClassName(fields[i].name + '-status')[0].innerText = "Некорректный e-mail";
                    fields[i].classList.add("error");
                    valids--;
                }
                break;
		}
        if (valids == 3) {
            var status = document.getElementById("send-status");
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status == 200) {
                        status.classList.add("ok");
                        status.innerHTML = "Ваше сообщение отправлено. Ожидайте звонка в течение 15 минут";
                    }
                    else if (xhr.status == 400) {
                        status.classList.remove("ok");
                        status.innerHTML = "Произошла ошибка отправки. Попробуйте позже";
                    }
                }
            }
            xhr.open('POST', 'db.php', true);
            xhr.send(userData + calcData.slice(1));
        }
    }
}

document.getElementById("calculate").onclick = function() {
    var shape = document.getElementById("shapes");
    var valids = 0;
    var isValid = false;
    var number = document.getElementsByClassName("number")[0];
    if (number.value != "" && number.value >= 1 && number.value <= 100) {
        calcData += '"number" : "' + number.value + '",';
        calcData += '"shape" : "' + shape.options[shape.selectedIndex].value + '",';
        number.classList.remove("error");
        valids++;
    }
    else {
        document.getElementsByClassName("number-status")[0].innerText = "Введите число от 1 до 100";
        number.classList.add("error");
        valids--;
    }
    switch(shape.selectedIndex) {
        case 1:
            var shapeParams = document.getElementsByClassName("p-params")[0];
            var params = shapeParams.getElementsByClassName("line-value");
            var measures = shapeParams.getElementsByClassName("measure");
            for (var i = 0; i < params.length; i++) {
                if (params[i].value != "" && params[i].value >= 1 && params[i].value <= 10) {
                    calcData += '"' + params[i].name + '" : { "value" : "' + params[i].value + '", "measure" : "' + measures[i].value + '"},';
                    params[i].classList.remove("error");
                    valids++;
                }
                else {
                    shapeParams.getElementsByClassName(params[i].name + "-status")[0].innerText = "Введите число от 1 до 10";
                    params[i].classList.add("error");
                    valids--;
                }
            }
            if (valids == 4) {
                isValid = true;
            }
            break;
        case 2:
            var shapeParams = document.getElementsByClassName("c-params")[0];
            var params = shapeParams.getElementsByClassName("line-value");
            var measures = shapeParams.getElementsByClassName("measure");
            for (var i = 0; i < params.length; i++) {
                if (params[i].value != "" && params[i].value >= 1 && params[i].value <= 10) {
                    calcData += '"' + params[i].name + '" : { "value" : "' + params[i].value + '", "measure" : "' + measures[i].value + '"},';
                    params[i].classList.remove("error");
                    valids++;
                }
                else {
                    shapeParams.getElementsByClassName(params[i].name + "-status")[0].innerText = "Введите число от 1 до 10";
                    params[i].classList.add("error");
                    valids--;
                }
            }
            if (valids == 3) {
                isValid = true;
            }
            break;
    }
    calcData = calcData.slice(0, -1);
    calcData += '}';
    if (isValid) {
        console.log(calcData);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    document.getElementById("modal-window").style.display = "block";
                    document.getElementById("calculation").innerHTML = xhr.responseText;
                }
                else if (xhr.status == 400) {
                    document.getElementById("modal-window").style.display = "block";
                    document.getElementById("calculation").innerHTML = "<p>Произошла ошибка</p>";
                }
            }
        }
        xhr.open('POST', 'volume.php', true);
        xhr.send(calcData);
    }
}

document.getElementById("cross").onclick = function() {
    var wnd = document.getElementById("modal-window");
    wnd.style.display = "none";
    var fields = wnd.getElementsByClassName("data");
    for (var i = 0; i < fields.length; i++) {
        fields[i].classList.remove("error");
        fields[i].value = "";
    }
    var status = wnd.getElementsByClassName("status");
    for (var i = 0; i < status.length; i++) {
        status[i].innerText = "";
    }
    calcData = '{';
}

var fields = document.getElementsByClassName("line-value");
for (var i = 0; i < fields.length; i++) {
    fields[i].onkeypress = function(e) {
        e = e || event;
        var source = e.target.name;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        var chr = getChar(e);
        if (chr == null) return;
        if (chr == '.' || chr == ',') {
            e.target.classList.add("error");
            document.getElementsByClassName(source + '-status')[0].innerText = "Допустимы только целые числа";
            return false;
        }
        else if (chr < '0' || chr > '9') {
            e.target.classList.add("error");
            document.getElementsByClassName(source + '-status')[0].innerText = "Неверный тип данных";
            return false;
        }
        else {
            e.target.classList.remove("error");
            document.getElementsByClassName(source + '-status')[0].innerText = "";
        }
    }
}

function getChar(event) {
    if (event.which == null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode)
    }
    if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which)
    }
    return null;
}