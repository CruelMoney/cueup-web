/* eslint-disable no-unused-expressions, no-script-url, no-sequences */

let loaded = false;
let currentOffset = 0;
export const loadSupportChat = () => {
    window.zEmbed ||
        (function (e, t) {
            let n;
            let o;
            let d;
            let i;
            let s;
            const a = [];
            const r = document.createElement('iframe');
            (window.zEmbed = function () {
                a.push(arguments);
            }),
                (window.zE = window.zE || window.zEmbed),
                (r.src = 'javascript:false'),
                (r.title = ''),
                (r.role = 'presentation'),
                ((r.frameElement || r).style.cssText = 'display: none'),
                (d = document.getElementsByTagName('script')),
                (d = d[d.length - 1]),
                d.parentNode.insertBefore(r, d),
                (i = r.contentWindow),
                (s = i.document);
            try {
                o = s;
            } catch (e) {
                (n = document.domain),
                    (r.src = 'javascript:var d=document.open();d.domain="' + n + '";void(0);'),
                    (o = s);
            }
            (o.open()._l = function () {
                const e = this.createElement('script');
                n && (this.domain = n),
                    (e.id = 'js-iframe-async'),
                    (e.src = 'https://assets.zendesk.com/embeddable_framework/main.js'),
                    (this.t = Number(new Date())),
                    (this.zendeskHost = 'cueup.zendesk.com'),
                    (this.zEQueue = a),
                    this.body.appendChild(e);
            }),
                o.write('<body onload="document._l();">'),
                o.close();
        })();
    window.zE(() => {
        window.$zopim.livechat.button.setOffsetVertical(currentOffset);
        window.$zopim.livechat.button.setOffsetVerticalMobile(currentOffset);
    });
    loaded = true;
};

export const showSupportChat = () => {
    if (!loaded) {
        loadSupportChat();
    }
    window.zE(() => {
        window.$zopim(() => {
            window.$zopim.livechat.button.setPosition('bl');
            window.$zopim.livechat.window.show();
        });
    });
};

export const hideChatButton = () => {
    if (!loaded) {
        loadSupportChat();
    }
    window.zE(() => {
        window.$zopim(() => {
            window.$zopim.livechat.button.hide();
        });
    });
};

export const showChatButton = () => {
    if (!loaded) {
        loadSupportChat();
    }
    window.zE(() => {
        window.$zopim(() => {
            window.$zopim.livechat.button.setOffsetVertical(150);
            window.$zopim.livechat.button.setPosition('bl');
            window.$zopim.livechat.button.setOffsetVertical(150);
            window.$zopim.livechat.button.show();
            window.$zopim.livechat.button.setOffsetVertical(150);
        });
    });
};

export const offsetChatButton = (y) => {
    currentOffset = y;
    if (!loaded) {
        loadSupportChat();
    }
    window.zE(() => {
        window.$zopim.livechat.button.setOffsetVertical(currentOffset);
        window.$zopim.livechat.button.setOffsetVerticalMobile(currentOffset);
    });
};
