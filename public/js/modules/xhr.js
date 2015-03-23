module.exports =  (function (){

    var options = {
        url: '/get',
        async: true,
        callback: function() {}
    },

    toParam = function (object) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    },

    extend = function (obj) {
        if (typeof obj !== "object") return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    return {
        get: function (cb, url) {
            if(cb && typeof cb === 'function') {
                options['callback'] = cb;
            }
            else {
                throw 'Callback не задан или имеет не верный тип данных'
            }

            if(url && typeof url === 'string') {
                options['url'] = url;
            }

            var xhr = new XMLHttpRequest();

            xhr.open('GET', options.url, options.async);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4 || xhr.status != 200) return;

                var resp = JSON.parse(xhr.responseText);

                options.callback(resp.data);
            };

            xhr.send(null);
        },
        post: function (url, data, cb){
            if(cb && typeof cb === 'function') {
                options['callback'] = cb;
            }
            else {
                throw 'Параметр Callback не задан или имеет не верный тип данных'
            }

            if(url && typeof url === 'string') {
                options['url'] = url;
            }
            else {
                throw 'Параметр url не задан или имеет не верный тип данных'
            }

            if(data && typeof data === 'object') {
                options['data'] = data;
            }
            else {
                throw 'Параметр data не задан или имеет не верный тип данных'
            }

            var xhr = new XMLHttpRequest();

            xhr.open('POST', '/'+options.url, options.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4 || xhr.status != 200) return;

                options.callback(xhr.responseText);
            };
            xhr.send(toParam(options.data));
        }
    }
})();