// Apply reflective material
AFRAME.registerComponent("camera-cube-env", {
  schema: {
    resolution: { type: "number", default: 128 },
    distance: { type: "number", default: 100 },
    interval: { type: "number", default: 100 },
    matoverride: { type: "boolean", default: false },
    metalness: { type: "float", default: 1.0 },
    roughness: { type: "float", default: 0.0 },
    repeat: { type: "boolean", default: true },
  },

  multiple: false,

  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.tick, this.data.interval, this);

    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
      this.data.resolution,
      {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
      }
    );
    this.cam = new THREE.CubeCamera(
      0.2,
      this.data.distance,
      this.cubeRenderTarget
    );

    this.el.object3D.add(this.cam);

    this.loaded = this.el.addEventListener("model-loaded", () => {
      const obj = this.el.getObject3D("mesh");
      obj.traverse((node) => {
        var myMesh = this.el.getObject3D("mesh");
        myMesh.visible = false;

        AFRAME.scenes[0].renderer.autoClear = true;
        var camVector = new THREE.Vector3();
        this.el.object3D.getWorldPosition(camVector);
        this.cam.position.copy(this.el.object3D.worldToLocal(camVector));
        this.cam.update(AFRAME.scenes[0].renderer, this.el.sceneEl.object3D);

        if (node.type.indexOf("Mesh") !== -1) {
          if (this.data.matoverride == true) {
            node.material.metalness = this.data.metalness;
            node.material.roughness = this.data.roughness;
          }
          node.material.envMap = this.cam.renderTarget.texture;
          node.material.needsUpdate = true;
        }
        myMesh.visible = true;
      });
    });
  },

  tick: function (t, dt) {
    if (!this.done) {
      this.redraw(this.cam, this.el, this.el.getObject3D("mesh"));
      if (!this.data.repeat) {
        this.done = true;
      }
    }
  },

  redraw: function (myCam, myEl, myMesh) {
    if (this.el.getObject3D("mesh") != null && AFRAME.scenes[0] != null) {
      myMesh.visible = false;

      AFRAME.scenes[0].renderer.autoClear = true;
      var camVector = new THREE.Vector3();
      myEl.object3D.getWorldPosition(camVector);
      myCam.position.copy(myEl.object3D.worldToLocal(camVector));
      myCam.update(AFRAME.scenes[0].renderer, myEl.sceneEl.object3D);
      if (myMesh) {
        myMesh.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.envMap = myCam.renderTarget.texture;
            child.material.needsUpdate = true;
          }
        });
      }
      myMesh.visible = true;
    }
  },

  update: function (oldData) {
    this.redraw(this.cam, this.el, this.el.getObject3D("mesh"));
  },

  remove: function () {
    this.loaded.remove();
  },

  pause: function () {},

  play: function () {},
});

// Add event when hovering over certain object
AFRAME.registerComponent("cursor-listener", {
  init: function () {
    this.el.addEventListener("raycaster-intersected", (evt) => {
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener("raycaster-intersected-cleared", (evt) => {
      this.raycaster = null;
    });
  },
  tick: function () {
    if (!this.raycaster) {
      return;
    }
    let intersection = this.raycaster.components.raycaster.getIntersection(
      this.el
    );
    if (!intersection) {
      return;
    } else if (intersection.object.el.getAttribute("id") == "door") {
      clearInterval(counter);
      console.log("win success");
      let completed = document.getElementById("completed");
      let material = completed.getAttribute("material");
      material = "src: #asset_completed; side: double; visible: true;";
      completed.setAttribute("material", material);

      let reloader_finish = document.getElementById("reloader_finish");
      let visible = reloader_finish.getAttribute("visible");
      visible = "true";
      reloader_finish.setAttribute("visible", visible);
    } else {
      init(width, height);
    }
  },
});
