/* Imgur Upload Script */
(function (root, factory) {
    sessionStorage.add = 0;
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Imgur = factory();
    }
}(this, function () {
    "use strict";
    var Imgur = function (options) {
        if (!this || !(this instanceof Imgur)) {
            return new Imgur(options);
        }

        if (!options) {
            options = {};
        }

        if (!options.clientid) {
            throw 'Provide a valid Client Id here: https://api.imgur.com/';
        }

        this.clientid = options.clientid;
        this.endpoint = 'https://api.imgur.com/3/image';
        this.callback = options.callback || undefined;
        this.dropzone = document.querySelectorAll('.dropzone');
        this.info = document.querySelectorAll('.info');

        this.run();
    };

    Imgur.prototype = {
        createEls: function (name, props, text) {
            var el = document.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            if (text) {
                el.appendChild(document.createTextNode(text));
            }
            return el;
        },
        insertAfter: function (referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        post: function (path, data, callback) {
            var xhttp = new XMLHttpRequest();

            xhttp.open('POST', path, true);
            xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 300) {
                        var response = '';
                        try {
                            response = JSON.parse(this.responseText);
                        } catch (err) {
                            response = this.responseText;
                        }
                        callback.call(window, response);
                    } else {
                        throw new Error(this.status + " - " + this.statusText);
                    }
                }
            };
            xhttp.send(data);
            xhttp = null;
        },
        createDragZone: function () {
            var p1, p2, input;

                p1 = this.createEls('p', {}, 'Kéo thả hình ảnh hoặc nhấp vào đây');
                p2 = this.createEls('p', {}, 'Hoặc Bấm Ctrl + V để post ảnh');
            input = this.createEls('input', {type: 'file', className: 'input', accept: 'image/*',multiple:'multiple'});

            Array.prototype.forEach.call(this.info, function (zone) {
                zone.appendChild(p1);
                zone.appendChild(p2);
            }.bind(this));
            Array.prototype.forEach.call(this.dropzone, function (zone) {
                zone.appendChild(input);
                this.status(zone);
                this.upload(zone);
            }.bind(this));
        },
        loading: function () {
            var div, table, img;

            div = this.createEls('div', {className: 'loading-modal'});
            table = this.createEls('table', {className: 'loading-table'});
            img = this.createEls('img', {className: 'loading-image', src: './css/loading-spin.svg'});

            div.appendChild(table);
            table.appendChild(img);
            document.body.appendChild(div);
        },
        status: function (el) {
            var div = this.createEls('div', {className: 'status'});

            //this.insertAfter(el, div);
        },
        matchFiles: function (file, zone) {
            var status = zone.nextSibling;

            if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
                //document.body.classList.add('loading');
              //  status.classList.remove('bg-success', 'bg-danger');
                status.innerHTML = '';

                var fd = new FormData();
                fd.append('image', file);

                this.post(this.endpoint, fd, function (data) {
                    //document.body.classList.remove('loading');
                    typeof this.callback === 'function' && this.callback.call(this, data);
                }.bind(this));
            } else {
                // status.classList.remove('bg-success');
                // status.classList.add('bg-danger');
                // status.innerHTML = 'Invalid archive';
            }
        },
        upload: function (zone) {
            var events = ['dragenter', 'dragleave', 'dragover', 'drop'],
                file, target, i, len;

            zone.addEventListener('change', function (e) {

                if (1 || ( e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file')) {
                    target = document.getElementsByTagName("input")[0].files;
					console.log(target);
                    for (i = 0, len = target.length; i < len; i += 1) {
                        var dem = sessionStorage.getItem("add");
                        file = target[i];
                        if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
                        this.matchFiles(file, zone);
					    name = '<div class="upload-process"><div class="item uploaded" style="display: block;"> <span class="check"><i class="icon icon-picture-o" id="icon-picture-o-'+dem+'" style="color:#aaa;"></i><i class="icon icon-check-square-o" id="icon-check-square-o-'+dem+'" style="color: #309320; display: none;"></i></span> <span class="name"><input class="transparent" value="'+file.name+'"></span> <span class="result"><i class="icon icon-arrow-right" style="color: #bbdb08;float:left;"></i> <input class="transparent" id="link'+dem+'" value="" style="display: none;"> <img class="loading" id="loading'+dem+'" src="img/loading.gif" style="display: inline-block;"> </span> </div></div>';
                        document.getElementById("list").insertAdjacentHTML("beforebegin", name);
                        sessionStorage.add = Number(sessionStorage.add)+1;
                    } else {
                        name = '<div class="upload-process"><div class="item uploaded" style="display: block;"> <span class="check"><i class="icon icon-times" style="color: #b33232; display: block;"></i></span> <span class="name"><input class="transparent" value="'+file.name+'"></span>  <span class="result"><i class="icon icon-arrow-right" style="color: #bbdb08;float:left;"></i><input class="transparent" id="link-error" value="File khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng" style="display: block;"></span> </div></div>';
                        document.getElementById("list").insertAdjacentHTML("beforebegin", name);
                    }
                }
                }
            }.bind(this), false);

            events.map(function (event) {
                zone.addEventListener(event, function (e) {
                    if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                        if (event === 'dragleave' || event === 'drop') {
                            e.target.parentNode.classList.remove('dropzone-dragging');
                        } else {
                            e.target.parentNode.classList.add('dropzone-dragging');
                        }
                    }
                }, false);
            });
        },
        run: function () {
            var loadingModal = document.querySelector('.loading-modal');

            if (!loadingModal) {
                this.loading();
            }
            this.createDragZone();
        }
    };

    return Imgur;
}));
