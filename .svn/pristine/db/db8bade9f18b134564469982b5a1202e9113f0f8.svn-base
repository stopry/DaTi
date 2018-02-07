//web平台截图
cc.Class({
  extends: cc.Component,

  properties: {
    captureAll: true
  },
  onLoad(){
    setTimeout(()=>{
      this.capture();
      this.captureAndShow();
    },1000);
  },
  capture () {
    if (cc.sys.isNative) {
      return;
    }

    var target = this.captureAll ? cc.director.getRunningScene() : this.node._sgNode;

    var width = Math.floor(cc.winSize.width), height = Math.floor(cc.winSize.height);
    var renderTexture = new cc.RenderTexture(width, height);
    // 如果包含 Mask，需要用
    // var renderTexture = cc.RenderTexture.create(width, height, cc.Texture2D.PixelFormat.RGBA8888, gl.DEPTH24_STENCIL8_OES);
    renderTexture.begin();
    target.visit();
    renderTexture.end();

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
      var texture = renderTexture.getSprite().getTexture();
      var image = texture.getHtmlElementObj();
      ctx.drawImage(image, 0, 0);
    }
    else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
      var buffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
      var texture = renderTexture.getSprite().getTexture().getHtmlElementObj();
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      var data = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      var rowBytes = width * 4;
      for (var row = 0; row < height; row++) {
        var srow = height - 1 - row;
        var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
        var imageData = new ImageData(data2, width, 1);
        ctx.putImageData(imageData, 0, row);
      }
    }

    var dataURL = canvas.toDataURL("image/jpeg");
    var img = document.createElement("img");
    img.src = dataURL;
    return img;
  },

  captureAndShow () {
    var img = this.capture();
    img.style.position = 'absolute';
    img.style.display = 'block';
    img.style.left = img.style.top = '0px';
    img.zIndex = 100;
    document.body.appendChild(img);
  }
});
